import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/server/db";
import { getSession, logAudit } from "@/server/auth";

export async function GET() {
  try {
    const db = await getDb();
    return NextResponse.json({ aboutContent: db.aboutContent });
  } catch (error) {
    console.error("Get about content error:", error);
    return NextResponse.json({ error: "Failed to load about content" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Super Admin privileges required" }, { status: 403 });
    }

    const body = await request.json();
    const db = await getDb();

    db.aboutContent = {
      ...db.aboutContent,
      ...body,
    };

    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "UPDATE_ABOUT_CONTENT",
      "ABOUT_CONFIG",
      { title: db.aboutContent.title }
    );

    return NextResponse.json({ success: true, aboutContent: db.aboutContent });
  } catch (error) {
    console.error("Update about content error:", error);
    return NextResponse.json({ error: "Failed to update about content" }, { status: 500 });
  }
}
