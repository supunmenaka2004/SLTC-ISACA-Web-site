import { NextResponse } from "next/server";
import { getSession, getLogoutCookieAttributes, logAudit } from "@/server/auth";

export async function POST() {
  try {
    const session = await getSession();
    if (session) {
      await logAudit(
        { userId: session.userId, userName: session.name, userRole: session.role },
        "LOGOUT",
        "AUTH",
        { email: session.email }
      );
    }

    const cookieOpts = getLogoutCookieAttributes();
    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    
    response.cookies.set(cookieOpts.name, cookieOpts.value, {
      httpOnly: cookieOpts.httpOnly,
      secure: cookieOpts.secure,
      sameSite: cookieOpts.sameSite,
      path: cookieOpts.path,
      maxAge: cookieOpts.maxAge,
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
