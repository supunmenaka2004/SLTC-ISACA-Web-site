import { NextResponse } from "next/server";
import { getDb } from "@/server/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const db = await getDb();

    // Only return PUBLISHED articles to the public site
    const publishedNews = db.news
      .filter((a) => a.status === "PUBLISHED")
      .sort((a, b) => new Date(b.publishedAt || b.publishedDate).getTime() - new Date(a.publishedAt || a.publishedDate).getTime());

    // Only non-archived committee members
    const committee = db.committee
      .filter((m) => !m.archived)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    // Only non-archived, visible team members
    const team = (db.team || [])
      .filter((t) => !t.archived && t.visible !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    // Only non-archived projects
    const projects = db.projects
      .filter((p) => !p.archived)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const response = NextResponse.json({
      theme: db.theme,
      siteSettings: db.siteSettings,
      homepage: db.homepage,
      aboutContent: db.aboutContent,
      team,
      committee,
      projects,
      news: publishedNews,
      newsCategories: db.newsCategories,
    });

    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    return response;
  } catch (error) {
    console.error("Public site-data fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch site data" }, { status: 500 });
  }
}
