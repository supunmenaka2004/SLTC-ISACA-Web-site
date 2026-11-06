import { NextResponse } from "next/server";
import { getSession } from "@/server/auth";
import { getDb } from "@/server/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const db = await getDb();
    const user = db.users.find((u) => u.id === session.userId);

    if (!user || user.status !== "ACTIVE") {
      return NextResponse.json({ authenticated: false, error: "User deactivated or removed" }, { status: 403 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (error) {
    console.error("Auth me check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
