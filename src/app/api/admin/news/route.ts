import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb, saveDb } from "@/server/db";
import { getSession, logAudit } from "@/server/auth";
import { NewsArticle } from "@/server/db/schema";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const myArticlesOnly = searchParams.get("mine") === "true";
    const query = searchParams.get("q")?.toLowerCase();
    const id = searchParams.get("id");

    const db = await getDb();

    // Single article lookup
    if (id) {
      const article = db.news.find((a) => a.id === id);
      if (!article) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
      }

      // Contributor can only view their own non-published articles
      if (
        session.role === "NEWS_CONTRIBUTOR" &&
        article.submittedBy?.userId !== session.userId &&
        article.status !== "PUBLISHED"
      ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const reviews = db.newsReviews.filter((r) => r.articleId === id);
      return NextResponse.json({ article, reviews });
    }

    let articles = [...db.news];

    // Role filtering: Contributor only sees their own or published
    if (session.role === "NEWS_CONTRIBUTOR" || myArticlesOnly) {
      if (myArticlesOnly || session.role === "NEWS_CONTRIBUTOR") {
        articles = articles.filter(
          (a) => a.submittedBy?.userId === session.userId || a.status === "PUBLISHED"
        );
      }
    }

    if (status && status !== "ALL") {
      articles = articles.filter((a) => a.status === status);
    }

    if (category && category !== "ALL") {
      articles = articles.filter((a) => a.category === category);
    }

    if (query) {
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.excerpt.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query) ||
          (a.author && a.author.toLowerCase().includes(query))
      );
    }

    // Sort: newest first
    articles.sort((a, b) => new Date(b.updatedAt || b.publishedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.publishedAt || a.createdAt).getTime());

    // Analytics / status counts
    const counts = {
      all: db.news.length,
      draft: db.news.filter((a) => a.status === "DRAFT").length,
      submitted: db.news.filter((a) => a.status === "SUBMITTED").length,
      underReview: db.news.filter((a) => a.status === "UNDER_REVIEW").length,
      changesRequested: db.news.filter((a) => a.status === "CHANGES_REQUESTED").length,
      approved: db.news.filter((a) => a.status === "APPROVED").length,
      published: db.news.filter((a) => a.status === "PUBLISHED").length,
      myDrafts: db.news.filter((a) => a.submittedBy?.userId === session.userId && a.status === "DRAFT").length,
      mySubmissions: db.news.filter((a) => a.submittedBy?.userId === session.userId).length,
    };

    return NextResponse.json({
      articles,
      counts,
      categories: db.newsCategories,
    });
  } catch (error) {
    console.error("Get news error:", error);
    return NextResponse.json({ error: "Failed to load news articles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      category,
      excerpt,
      content,
      sections,
      keyHighlights,
      technicalInformation,
      affectedSystems,
      securityRecommendations,
      image,
      imageAlt,
      publisher,
      author,
      sourceUrl,
      sourceName,
      featured,
      trending,
      tags,
    } = body;

    if (!title || !category || !excerpt) {
      return NextResponse.json({ error: "Title, category, and summary excerpt are required" }, { status: 400 });
    }

    const db = await getDb();
    const articleId = `news-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`;
    const generatedSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newArticle: NewsArticle = {
      id: articleId,
      slug: generatedSlug,
      title: title.trim(),
      category: category.trim(),
      publishedDate: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }),
      publishedAt: new Date().toISOString(),
      excerpt: excerpt.trim(),
      content: Array.isArray(content) ? content : [content || excerpt],
      sections: sections || [],
      keyHighlights: keyHighlights || [],
      technicalInformation: technicalInformation || [],
      affectedSystems: affectedSystems || [],
      securityRecommendations: securityRecommendations || [],
      image: image || "/cyber_hero.jpg",
      imageAlt: imageAlt || title,
      publisher: publisher || "ISACA Student Chapter",
      author: author || session.name,
      sourceUrl: sourceUrl || undefined,
      sourceName: sourceName || undefined,
      featured: Boolean(featured),
      trending: Boolean(trending),
      status: "DRAFT",
      submittedBy: {
        userId: session.userId,
        userName: session.name,
        userEmail: session.email,
      },
      tags: tags || [category, "Cybersecurity"],
      readingTimeMinutes: Math.max(1, Math.ceil((title.length + excerpt.length + (content?.join(" ")?.length || 0)) / 1000)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.news.unshift(newArticle);
    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "CREATE_ARTICLE",
      "NEWS_ARTICLE",
      { title: newArticle.title, id: newArticle.id },
      newArticle.id
    );

    return NextResponse.json({ success: true, article: newArticle }, { status: 201 });
  } catch (error) {
    console.error("Create article error:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Article ID required" }, { status: 400 });
    }

    const db = await getDb();
    const article = db.news.find((a) => a.id === id);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Role security check: Contributor can only update their own Draft or Changes-Requested articles
    if (session.role === "NEWS_CONTRIBUTOR") {
      if (article.submittedBy?.userId !== session.userId) {
        return NextResponse.json({ error: "You can only edit your own articles" }, { status: 403 });
      }
      if (article.status !== "DRAFT" && article.status !== "CHANGES_REQUESTED") {
        return NextResponse.json(
          { error: `Cannot edit an article in status '${article.status}'. It is already submitted for editorial review.` },
          { status: 400 }
        );
      }
    }

    // Apply allowed fields
    const allowedFields = [
      "title",
      "slug",
      "category",
      "excerpt",
      "content",
      "sections",
      "keyHighlights",
      "technicalInformation",
      "affectedSystems",
      "securityRecommendations",
      "image",
      "imageAlt",
      "publisher",
      "author",
      "sourceUrl",
      "sourceName",
      "featured",
      "trending",
      "tags",
      "seoTitle",
      "seoDescription",
    ];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (article as any)[field] = updates[field];
      }
    });

    article.updatedAt = new Date().toISOString();
    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "UPDATE_ARTICLE",
      "NEWS_ARTICLE",
      { title: article.title, id: article.id },
      article.id
    );

    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error("Update article error:", error);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Article ID required" }, { status: 400 });
    }

    const db = await getDb();
    const index = db.news.findIndex((a) => a.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const article = db.news[index];

    // Contributor can only delete their own draft
    if (session.role === "NEWS_CONTRIBUTOR") {
      if (article.submittedBy?.userId !== session.userId || article.status !== "DRAFT") {
        return NextResponse.json({ error: "Contributors can only delete their own drafts" }, { status: 403 });
      }
    } else if (session.role === "NEWS_EDITOR") {
      return NextResponse.json({ error: "Only Chief Editor or Super Admin can delete submitted articles" }, { status: 403 });
    }

    db.news.splice(index, 1);
    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "DELETE_ARTICLE",
      "NEWS_ARTICLE",
      { title: article.title, id },
      id
    );

    return NextResponse.json({ success: true, message: "Article removed successfully" });
  } catch (error) {
    console.error("Delete article error:", error);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
