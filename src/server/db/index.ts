import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { AppDatabase, ThemeConfiguration, SiteSettings, HomepageConfig, AboutContentConfig, NewsArticle, TeamMember } from "./schema";
import { newsData, newsCategories } from "@/data/newsData";
import { committeeData } from "@/data/committeeData";
import { projectsData } from "@/data/projectsData";
import { fullCommitteeMembers } from "@/data/team";

const DB_DIR = path.join(process.cwd(), "src", "data", "db");
const DB_FILE = path.join(DB_DIR, "storage.json");
const DB_TMP_FILE = path.join(DB_DIR, "storage.json.tmp");

// In-memory cache for fast read operations
let memoryDb: AppDatabase | null = null;
let writeQueue: Promise<void> = Promise.resolve();

import { defaultTheme, defaultSiteSettings, defaultHomepageConfig, defaultAboutConfig } from "./defaults";
export { defaultTheme, defaultSiteSettings, defaultHomepageConfig, defaultAboutConfig } from "./defaults";

function hashPasswordHelper(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

// Initial database seeding
export function createInitialDatabase(): AppDatabase {
  const superAdmin = hashPasswordHelper("AdminPassword2026!");
  const chiefEditor = hashPasswordHelper("ChiefEditor2026!");
  const newsEditor = hashPasswordHelper("NewsEditor2026!");
  const contributor = hashPasswordHelper("Contributor2026!");

  const seededNews: NewsArticle[] = newsData.map((item, index) => ({
    id: item.id || `news-${index + 1}`,
    slug: item.id || `news-slug-${index + 1}`,
    title: item.title,
    category: item.category,
    publishedDate: item.publishedDate,
    publishedAt: item.publishedAt,
    excerpt: item.excerpt,
    content: item.content || [],
    sections: item.sections,
    keyHighlights: item.keyHighlights,
    technicalInformation: item.technicalInformation,
    affectedSystems: item.affectedSystems,
    securityRecommendations: item.securityRecommendations,
    image: item.image,
    imageAlt: item.imageAlt,
    publisher: item.publisher,
    author: item.author || "ISACA Editorial Board",
    sourceUrl: item.sourceUrl,
    sourceName: item.sourceName,
    featured: item.featured ?? false,
    trending: item.trending ?? false,
    status: "PUBLISHED",
    submittedBy: {
      userId: "usr-admin-1",
      userName: "SLTC ISACA Super Admin",
      userEmail: "admin@isaca.sltc.lk",
    },
    readingTimeMinutes: 5,
    seoTitle: item.title,
    seoDescription: item.excerpt,
    tags: [item.category, "Cybersecurity", "ISACA"],
    createdAt: item.publishedAt || new Date().toISOString(),
    updatedAt: item.publishedAt || new Date().toISOString(),
  }));

  const seededCommittee = committeeData.map((m, index) => ({
    ...m,
    order: index + 1,
    archived: false,
  }));

  const seededProjects = projectsData.map((p, index) => ({
    ...p,
    order: index + 1,
    archived: false,
  }));

  const seededTeam: TeamMember[] = fullCommitteeMembers.map((m, index) => ({
    id: m.id || `team-${index + 1}`,
    name: m.name,
    role: m.role,
    image: m.image,
    description: m.description,
    socialLinks: m.socialLinks || {},
    order: index + 1,
    archived: false,
    visible: true,
  }));

  return {
    users: [
      {
        id: "usr-admin-1",
        email: "admin@isaca.sltc.lk",
        passwordHash: superAdmin.hash,
        salt: superAdmin.salt,
        name: "SLTC ISACA Super Admin",
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr-chief-1",
        email: "chief.editor@isaca.sltc.lk",
        passwordHash: chiefEditor.hash,
        salt: chiefEditor.salt,
        name: "Devindi Silva (Chief Editor)",
        role: "CHIEF_EDITOR",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr-editor-1",
        email: "news.editor@isaca.sltc.lk",
        passwordHash: newsEditor.hash,
        salt: newsEditor.salt,
        name: "Naveen Perera (News Editor)",
        role: "NEWS_EDITOR",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr-contrib-1",
        email: "contributor@isaca.sltc.lk",
        passwordHash: contributor.hash,
        salt: contributor.salt,
        name: "Sanduni Fernando (News Contributor)",
        role: "NEWS_CONTRIBUTOR",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      },
    ],
    siteSettings: defaultSiteSettings,
    theme: defaultTheme,
    themeDraft: { ...defaultTheme, isDraft: true },
    themeVersions: [
      {
        id: "ver-1",
        version: 1,
        label: "Default Brand Baseline",
        config: defaultTheme,
        savedBy: "Super Admin",
        createdAt: new Date().toISOString(),
      },
    ],
    media: [
      {
        id: "med-logo-1",
        filename: "isaca_full_logo.png",
        originalName: "isaca_full_logo.png",
        mimeType: "image/png",
        size: 45000,
        url: "/isaca_full_logo.png",
        altText: "Official ISACA Student Group Logo",
        category: "logo",
        uploadedBy: "System",
        uploadedAt: new Date().toISOString(),
      },
      {
        id: "med-logo-2",
        filename: "isaca_transparent.png",
        originalName: "isaca_transparent.png",
        mimeType: "image/png",
        size: 38000,
        url: "/isaca_transparent.png",
        altText: "ISACA Transparent Navbar Emblem",
        category: "logo",
        uploadedBy: "System",
        uploadedAt: new Date().toISOString(),
      },
      {
        id: "med-hero-1",
        filename: "cyber_hero.jpg",
        originalName: "cyber_hero.jpg",
        mimeType: "image/jpeg",
        size: 180000,
        url: "/cyber_hero.jpg",
        altText: "SLTC Cyber Lab Ambient Background",
        category: "hero",
        uploadedBy: "System",
        uploadedAt: new Date().toISOString(),
      },
      {
        id: "med-about-1",
        filename: "about.jpg",
        originalName: "about.jpg",
        mimeType: "image/jpeg",
        size: 154000,
        url: "/about.jpg",
        altText: "ISACA Committee Team Showcase",
        category: "general",
        uploadedBy: "System",
        uploadedAt: new Date().toISOString(),
      },
    ],
    team: seededTeam,
    committee: seededCommittee,
    projects: seededProjects,
    messages: [
      {
        id: "msg-seed-1",
        name: "Hirun Senaratne",
        email: "hirun.s@sltc.ac.lk",
        studentId: "IT220894",
        message: "Hello ISACA Team, I am interested in joining the upcoming ethical hacking bootcamp and CTF competitions. How can I enroll in the technical track?",
        status: "unread",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
      {
        id: "msg-seed-2",
        name: "Rashmika Weerasinghe",
        email: "rashmika.w@industrypartners.lk",
        message: "Greetings from TechSecurity Partners. We would like to discuss sponsoring the next ISACA Cyber Summit and conducting an industry guest session on Cloud Forensics.",
        status: "read",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
        notes: "Reviewed by President. Forwarded to VP for sponsorship prospectus follow-up.",
      },
    ],
    news: seededNews,
    newsCategories: [...newsCategories],
    newsReviews: [],
    auditLogs: [
      {
        id: "audit-init",
        userId: "usr-admin-1",
        userName: "SLTC ISACA Super Admin",
        userRole: "SUPER_ADMIN",
        action: "SYSTEM_INITIALIZED",
        resource: "SYSTEM",
        details: "Centralized Website Administration System initialized with secure defaults.",
        ip: "127.0.0.1",
        timestamp: new Date().toISOString(),
      },
    ],
    homepage: defaultHomepageConfig,
    aboutContent: defaultAboutConfig,
  };
}

export async function getDb(): Promise<AppDatabase> {
  if (memoryDb) {
    return memoryDb;
  }

  try {
    await fs.mkdir(DB_DIR, { recursive: true });
    const content = await fs.readFile(DB_FILE, "utf-8");
    memoryDb = JSON.parse(content) as AppDatabase;

    // Self-healing migration for team collection
    if (!memoryDb.team || memoryDb.team.length === 0) {
      memoryDb.team = fullCommitteeMembers.map((m, index) => ({
        id: m.id || `team-${index + 1}`,
        name: m.name,
        role: m.role,
        image: m.image,
        description: m.description,
        socialLinks: m.socialLinks || {},
        order: index + 1,
        archived: false,
        visible: true,
      }));
      await saveDb(memoryDb);
    }

    // Self-healing migration for standard 3-tier admin accounts
    let userModified = false;
    if (!memoryDb.users.some((u) => u.email === "content.admin@isaca.sltc.lk")) {
      const contentAdmin = hashPasswordHelper("ContentAdmin2026!");
      memoryDb.users.push({
        id: "usr-content-1",
        email: "content.admin@isaca.sltc.lk",
        passwordHash: contentAdmin.hash,
        salt: contentAdmin.salt,
        name: "Devindi Silva (Content Admin)",
        role: "CONTENT_ADMIN",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      });
      userModified = true;
    }

    if (!memoryDb.users.some((u) => u.email === "viewer@isaca.sltc.lk")) {
      const viewer = hashPasswordHelper("ViewerPassword2026!");
      memoryDb.users.push({
        id: "usr-viewer-1",
        email: "viewer@isaca.sltc.lk",
        passwordHash: viewer.hash,
        salt: viewer.salt,
        name: "Auditor Guest (Viewer)",
        role: "VIEWER",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      });
      userModified = true;
    }

    if (userModified) {
      await saveDb(memoryDb);
    }

    return memoryDb;
  } catch {
    // If not exists or parse error, initialize database
    memoryDb = createInitialDatabase();
    await saveDb(memoryDb);
    return memoryDb;
  }
}

export async function saveDb(db: AppDatabase): Promise<void> {
  memoryDb = db;

  // Queue writes sequentially to prevent file writing races
  writeQueue = writeQueue.then(async () => {
    try {
      await fs.mkdir(DB_DIR, { recursive: true });
      const serialized = JSON.stringify(db, null, 2);

      // Windows-resilient file save pattern:
      // Retry rename up to 5 times with backoff, or fallback to copyFile/writeFile to prevent Windows EPERM lock issues
      let written = false;
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          await fs.writeFile(DB_TMP_FILE, serialized, "utf-8");
          await fs.rename(DB_TMP_FILE, DB_FILE);
          written = true;
          break;
        } catch (renameErr: unknown) {
          const code = (renameErr as { code?: string })?.code;
          if (code === "EPERM" || code === "EBUSY" || code === "EACCES") {
            await new Promise((r) => setTimeout(r, 60 * (attempt + 1)));
          } else {
            throw renameErr;
          }
        }
      }

      if (!written) {
        try {
          await fs.copyFile(DB_TMP_FILE, DB_FILE);
          await fs.unlink(DB_TMP_FILE).catch(() => {});
        } catch {
          await fs.writeFile(DB_FILE, serialized, "utf-8");
        }
      }
    } catch (err) {
      console.error("[Database] Failed to save DB to disk:", err);
    }
  });

  return writeQueue;
}
