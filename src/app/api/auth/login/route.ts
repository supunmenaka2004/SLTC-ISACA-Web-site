import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/server/db";
import { verifyPassword, signSession, getSessionCookieAttributes, logAudit } from "@/server/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const db = await getDb();
    const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password credentials" }, { status: 401 });
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json({ error: "This administrator account is currently deactivated" }, { status: 403 });
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password credentials" }, { status: 401 });
    }

    // Update last login
    user.lastLoginAt = new Date().toISOString();
    await saveDb(db);

    const sessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    };

    const token = signSession(sessionPayload);
    const cookieOpts = getSessionCookieAttributes(token);

    // Audit log
    await logAudit(
      { userId: user.id, userName: user.name, userRole: user.role },
      "LOGIN",
      "AUTH",
      { email: user.email }
    );

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set(cookieOpts.name, cookieOpts.value, {
      httpOnly: cookieOpts.httpOnly,
      secure: cookieOpts.secure,
      sameSite: cookieOpts.sameSite,
      path: cookieOpts.path,
      maxAge: cookieOpts.maxAge,
    });

    return response;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json({ error: "An unexpected authentication error occurred" }, { status: 500 });
  }
}
