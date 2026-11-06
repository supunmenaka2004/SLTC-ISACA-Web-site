import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/server/db";
import { getSession, logAudit } from "@/server/auth";

export async function GET() {
  try {
    const db = await getDb();
    return NextResponse.json({ homepage: db.homepage });
  } catch (error) {
    console.error("Get homepage config error:", error);
    return NextResponse.json({ error: "Failed to load homepage configuration" }, { status: 500 });
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

    db.homepage = {
      ...db.homepage,
      ...body,
    };

    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "UPDATE_HOMEPAGE",
      "HOMEPAGE_CONFIG",
      { heroTitle: db.homepage.heroTitle }
    );

    return NextResponse.json({ success: true, homepage: db.homepage });
  } catch (error) {
    console.error("Update homepage config error:", error);
    return NextResponse.json({ error: "Failed to update homepage configuration" }, { status: 500 });
  }
}
