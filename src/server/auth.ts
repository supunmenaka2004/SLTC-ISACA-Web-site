import crypto from "crypto";
import { cookies } from "next/headers";
import { AdminUser, AuditLog, UserRole } from "./db/schema";
import { getDb, saveDb } from "./db";

const SESSION_COOKIE_NAME = "sltc_isaca_admin_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "sltc_isaca_secure_super_secret_key_2026_entropy_token";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  exp: number;
}

// Password hashing using Node.js crypto scrypt
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const derived = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(derived, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}

// Sign payload with HMAC-SHA256
export function signSession(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const hmac = crypto.createHmac("sha256", SESSION_SECRET);
  hmac.update(data);
  const signature = hmac.digest("base64url");
  return `${data}.${signature}`;
}

// Verify signed session token
export function verifySession(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [data, signature] = parts;

    const hmac = crypto.createHmac("sha256", SESSION_SECRET);
    hmac.update(data);
    const expectedSignature = hmac.digest("base64url");

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as SessionPayload;
    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// Next.js cookie session retrieval
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie?.value) return null;
    return verifySession(sessionCookie.value);
  } catch {
    return null;
  }
}

export function getSessionCookieAttributes(token: string) {
  return {
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export function getLogoutCookieAttributes() {
  return {
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}

// Role based access checker
export function hasPermission(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  if (userRole === "SUPER_ADMIN") return true;
  return allowedRoles.includes(userRole);
}

// Audit logger helper
export async function logAudit(
  user: { userId: string; userName: string; userRole: UserRole },
  action: string,
  resource: string,
  details?: Record<string, unknown> | string,
  resourceId?: string,
  ip?: string
): Promise<void> {
  const db = await getDb();
  const entry: AuditLog = {
    id: `audit-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
    userId: user.userId,
    userName: user.userName,
    userRole: user.userRole,
    action,
    resource,
    resourceId,
    details,
    ip: ip || "127.0.0.1",
    timestamp: new Date().toISOString(),
  };
  db.auditLogs.unshift(entry);
  // Keep last 1000 logs
  if (db.auditLogs.length > 1000) {
    db.auditLogs = db.auditLogs.slice(0, 1000);
  }
  await saveDb(db);
}
