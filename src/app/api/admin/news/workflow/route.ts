import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb, saveDb } from "@/server/db";
import { getSession, logAudit } from "@/server/auth";
import { NewsReviewLog } from "@/server/db/schema";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { articleId, action, feedback } = body;

    if (!articleId || !action) {
      return NextResponse.json({ error: "Article ID and Action are required" }, { status: 400 });
    }

    const db = await getDb();
    const article = db.news.find((a) => a.id === articleId);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const userRole = session.role;
    let newStatus = article.status;

    switch (action) {
      case "SUBMIT": {
        // Contributor or Editor submitting draft
        if (article.status !== "DRAFT" && article.status !== "CHANGES_REQUESTED") {
          return NextResponse.json({ error: `Cannot submit article in '${article.status}' status` }, { status: 400 });
        }
        newStatus = "SUBMITTED";
        break;
      }

      case "START_REVIEW": {
        if (userRole === "NEWS_CONTRIBUTOR") {
          return NextResponse.json({ error: "News Contributors cannot review articles" }, { status: 403 });
        }
        if (article.status !== "SUBMITTED" && article.status !== "CHANGES_REQUESTED") {
          return NextResponse.json({ error: `Cannot review article from current status '${article.status}'` }, { status: 400 });
        }
        newStatus = "UNDER_REVIEW";
        break;
      }

      case "REQUEST_CHANGES": {
        if (userRole === "NEWS_CONTRIBUTOR") {
          return NextResponse.json({ error: "News Contributors cannot request changes" }, { status: 403 });
        }
        if (!feedback || feedback.trim().length === 0) {
          return NextResponse.json({ error: "Editorial feedback note is required when requesting changes" }, { status: 400 });
        }
        newStatus = "CHANGES_REQUESTED";
        article.reviewerNotes = feedback.trim();
        break;
      }

      case "APPROVE": {
        if (userRole !== "CHIEF_EDITOR" && userRole !== "SUPER_ADMIN") {
          return NextResponse.json({ error: "Only Chief Editor or Super Admin can approve articles" }, { status: 403 });
        }
        newStatus = "APPROVED";
        article.approvedBy = session.name;
        break;
      }

      case "PUBLISH": {
        if (userRole !== "CHIEF_EDITOR" && userRole !== "SUPER_ADMIN") {
          return NextResponse.json({ error: "Only Chief Editor or Super Admin have publication authorization" }, { status: 403 });
        }
        newStatus = "PUBLISHED";
        article.publishedBy = session.name;
        article.publishedAt = new Date().toISOString();
        article.publishedDate = new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
        break;
      }

      case "UNPUBLISH": {
        if (userRole !== "CHIEF_EDITOR" && userRole !== "SUPER_ADMIN") {
          return NextResponse.json({ error: "Only Chief Editor or Super Admin can unpublish articles" }, { status: 403 });
        }
        newStatus = "APPROVED";
        break;
      }

      case "REJECT": {
        if (userRole !== "CHIEF_EDITOR" && userRole !== "SUPER_ADMIN") {
          return NextResponse.json({ error: "Only Chief Editor or Super Admin can reject submissions" }, { status: 403 });
        }
        newStatus = "REJECTED";
        if (feedback) {
          article.reviewerNotes = feedback.trim();
        }
        break;
      }

      default:
        return NextResponse.json({ error: "Unknown workflow action" }, { status: 400 });
    }

    const previousStatus = article.status;
    article.status = newStatus;
    article.updatedAt = new Date().toISOString();

    // Log in news review trail
    const reviewLog: NewsReviewLog = {
      id: `rev-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
      articleId: article.id,
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      action: action as NewsReviewLog["action"],
      feedback: feedback?.trim() || undefined,
      timestamp: new Date().toISOString(),
    };

    db.newsReviews.unshift(reviewLog);
    await saveDb(db);

    // Global audit trail
    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      `NEWS_${action}`,
      "NEWS_WORKFLOW",
      { articleId: article.id, title: article.title, from: previousStatus, to: newStatus, feedback },
      article.id
    );

    return NextResponse.json({
      success: true,
      article,
      reviewLog,
      message: `Article status updated to ${newStatus}`,
    });
  } catch (error) {
    console.error("News workflow transition error:", error);
    return NextResponse.json({ error: "Failed to transition article workflow" }, { status: 500 });
  }
}
