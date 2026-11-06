import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "sltc_isaca_admin_session";
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || "sltc_isaca_secure_super_secret_key_2026_entropy_token";

/**
 * Web Crypto HMAC-SHA256 signature verification (runs fast in any JS environment)
 */
async function verifyTokenSignature(token: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [data, signature] = parts;

    // Decode payload
    const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4 ? "=".repeat(4 - (base64.length % 4)) : "";
    const rawPayload = atob(base64 + pad);
    const payload = JSON.parse(rawPayload);

    if (!payload.exp || Date.now() > payload.exp) {
      return false;
    }

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(SESSION_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(data));
    const base64UrlSig = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    return base64UrlSig === signature;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const isLoginPage = pathname === "/admin/login";

    const isValid = sessionCookie ? await verifyTokenSignature(sessionCookie) : false;

    // If on /admin/login but already logged in, redirect to /admin dashboard
    if (isLoginPage) {
      if (isValid) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // If accessing any protected /admin route without a valid session, redirect to /admin/login
    if (!isValid) {
      const loginUrl = new URL("/admin/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      if (sessionCookie) {
        response.cookies.delete(SESSION_COOKIE_NAME);
      }
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
