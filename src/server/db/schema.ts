export type UserRole = "SUPER_ADMIN" | "CONTENT_ADMIN" | "VIEWER" | "CHIEF_EDITOR" | "NEWS_EDITOR" | "NEWS_CONTRIBUTOR";

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  name: string;
  role: UserRole;
  avatar?: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  lastLoginAt?: string;
}

export interface SiteSettings {
  siteTitle: string;
  tagline: string;
  description: string;
  keywords: string[];
  ogImage: string;
  twitterCard: string;
  canonicalUrl: string;
  favicon: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socials: {
    linkedin?: string;
    github?: string;
    youtube?: string;
    instagram?: string;
  };
}

export interface ThemeColors {
  bgMain: string;
  bgSection: string;
  bgCard: string;
  textWhite: string;
  textSlate: string;
  textMuted: string;
  cyanAccent: string;
  skyAccent: string;
  emeraldAccent: string;
  borderCard: string;
  borderHover: string;
  buttonBg: string;
  buttonText: string;
  buttonBorder: string;
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
  baseFontSize: string; // e.g., '16px'
  headingWeight: string; // '600' | '700' | '800'
  lineHeight: string; // '1.6'
  letterSpacing: string; // '-0.02em'
}

export interface ThemeComponents {
  buttonRadius: string; // 'sm' | 'md' | 'full' | 'none'
  cardRadius: string;
  cardGlow: boolean;
  glassmorphism: boolean;
}

export interface ThemeLogo {
  mainLogo: string;
  transparentLogo: string;
  favicon: string;
  logoHeight: number;
}

export interface ThemeConfiguration {
  id: string;
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  components: ThemeComponents;
  logo: ThemeLogo;
  isDraft: boolean;
  version: number;
  updatedAt: string;
}

export interface ThemeVersion {
  id: string;
  version: number;
  label: string;
  config: ThemeConfiguration;
  savedBy: string;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  altText: string;
  category: "logo" | "hero" | "committee" | "team" | "project" | "news" | "general";
  uploadedBy: string;
  uploadedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  description: string;
  socialLinks: {
    linkedin?: string;
    instagram?: string;
    github?: string;
  };
  order: number;
  archived?: boolean;
  visible?: boolean;
}

export interface CommitteeMember {
  id: string;
  name: string;
  position: string;
  initials: string;
  category: "Executive" | "Technical" | "Operations";
  bio: string;
  linkedin: string;
  github?: string;
  instagram?: string;
  email: string;
  image?: string;
  order: number;
  archived?: boolean;
}

export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  description: string;
  status: "Active" | "Completed" | "Ongoing";
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  order: number;
  archived?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  subject?: string;
  message: string;
  status: "unread" | "read" | "responded" | "archived";
  createdAt: string;
  notes?: string;
}

export type ArticleStatus = 
  | "DRAFT" 
  | "SUBMITTED" 
  | "UNDER_REVIEW" 
  | "CHANGES_REQUESTED" 
  | "APPROVED" 
  | "PUBLISHED" 
  | "REJECTED" 
  | "ARCHIVED";

export interface NewsArticleSection {
  heading: string;
  paragraphs: string[];
  points?: string[];
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  publishedDate: string;
  publishedAt: string;
  excerpt: string;
  content: string[];
  sections?: NewsArticleSection[];
  keyHighlights?: string[];
  technicalInformation?: string[];
  affectedSystems?: string[];
  securityRecommendations?: string[];
  image: string;
  imageAlt: string;
  publisher: string;
  author?: string;
  sourceUrl?: string;
  sourceName?: string;
  featured?: boolean;
  trending?: boolean;
  status: ArticleStatus;
  submittedBy: {
    userId: string;
    userName: string;
    userEmail: string;
  };
  reviewerNotes?: string;
  approvedBy?: string;
  publishedBy?: string;
  readingTimeMinutes?: number;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NewsReviewLog {
  id: string;
  articleId: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: "SUBMIT" | "START_REVIEW" | "REQUEST_CHANGES" | "APPROVE" | "PUBLISH" | "UNPUBLISH" | "REJECT";
  feedback?: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown> | string;
  ip?: string;
  timestamp: string;
}

export interface WordColor {
  text: string;
  color?: string; // hex (e.g. '#22d3ee'), CSS linear-gradient string, or preset name ('gradient' | 'cyan' | 'white' | 'emerald' | 'amber' | 'purple' | 'rose' | 'sky')
}

export interface CustomGradient {
  id: string;
  name: string;
  css: string;
}

export interface HomepageConfig {
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroImages?: string[];
  visibleSections: {
    hero: boolean;
    aboutPreview: boolean;
    teamPreview: boolean;
    committeePreview?: boolean;
    eventsPreview: boolean;
    newsPreview: boolean;
  };
  sectionOrder: string[];
  aboutPreviewTitle: string;
  aboutPreviewTitleWords?: WordColor[];
  aboutPreviewKicker: string;
  aboutPreviewIcon?: string;
  aboutPreviewDesc: string;
  aboutPreviewCtaText: string;
  aboutPreviewCtaLink: string;
  aboutPreviewImage: string;
  teamPreviewTitle?: string;
  teamPreviewTitleWords?: WordColor[];
  teamPreviewKicker?: string;
  teamPreviewIcon?: string;
  teamPreviewDesc?: string;
  committeePreviewTitle?: string;
  committeePreviewTitleWords?: WordColor[];
  committeePreviewKicker?: string;
  committeePreviewIcon?: string;
  committeePreviewCtaText?: string;
  committeePreviewDesc?: string;
  eventsPreviewTitle?: string;
  eventsPreviewTitleWords?: WordColor[];
  eventsPreviewKicker?: string;
  eventsPreviewIcon?: string;
  eventsPreviewCtaText?: string;
  eventsPreviewDesc?: string;
  newsPreviewTitle?: string;
  newsPreviewTitleWords?: WordColor[];
  newsPreviewKicker?: string;
  newsPreviewIcon?: string;
  newsPreviewCtaText?: string;
  newsPreviewDesc?: string;
  customGradients?: CustomGradient[];
}

export interface AboutContentConfig {
  title: string;
  subtitle: string;
  mainIntro: string;
  secondaryIntro: string;
  affiliationTitle: string;
  affiliationPoints: string[];
  mission: string;
  vision: string;
  values: {
    title: string;
    description: string;
  }[];
}

export interface AppDatabase {
  users: AdminUser[];
  siteSettings: SiteSettings;
  theme: ThemeConfiguration;
  themeDraft: ThemeConfiguration;
  themeVersions: ThemeVersion[];
  media: MediaAsset[];
  team: TeamMember[];
  committee: CommitteeMember[];
  projects: ProjectItem[];
  messages: ContactMessage[];
  news: NewsArticle[];
  newsCategories: string[];
  newsReviews: NewsReviewLog[];
  auditLogs: AuditLog[];
  homepage: HomepageConfig;
  aboutContent: AboutContentConfig;
}
