import { NextResponse } from "next/server";
import { getDb } from "@/server/db";
import { getSession } from "@/server/auth";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Super Admin privileges required to view audit trail" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const query = searchParams.get("q")?.toLowerCase();

    const db = await getDb();
    let logs = [...db.auditLogs];

    if (action && action !== "ALL") {
      logs = logs.filter((l) => l.action.toLowerCase() === action.toLowerCase());
    }

    if (query) {
      logs = logs.filter(
        (l) =>
          l.userName.toLowerCase().includes(query) ||
          l.action.toLowerCase().includes(query) ||
          l.resource.toLowerCase().includes(query) ||
          (typeof l.details === "string" && l.details.toLowerCase().includes(query)) ||
          (l.details && JSON.stringify(l.details).toLowerCase().includes(query))
      );
    }

    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ logs: logs.slice(0, 500), total: logs.length });
  } catch (error) {
    console.error("Get audit logs error:", error);
    return NextResponse.json({ error: "Failed to load audit logs" }, { status: 500 });
  }
}
