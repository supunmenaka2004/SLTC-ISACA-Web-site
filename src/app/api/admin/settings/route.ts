import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/server/db";
import { getSession, logAudit } from "@/server/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    return NextResponse.json({ settings: db.siteSettings });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json({ error: "Failed to load site settings" }, { status: 500 });
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

    db.siteSettings = {
      ...db.siteSettings,
      ...body,
    };

    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "UPDATE_SITE_SETTINGS",
      "SETTINGS",
      { siteTitle: db.siteSettings.siteTitle }
    );

    return NextResponse.json({ success: true, settings: db.siteSettings });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Failed to update site settings" }, { status: 500 });
  }
}
