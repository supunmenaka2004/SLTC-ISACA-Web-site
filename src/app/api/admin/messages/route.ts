import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/server/db";
import { getSession, logAudit } from "@/server/auth";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let messages = db.messages || [];
    if (status && status !== "all") {
      messages = messages.filter((m) => m.status === status);
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Admin messages GET error:", error);
    return NextResponse.json({ error: "Failed to retrieve messages" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Message ID required" }, { status: 400 });
    }

    const db = await getDb();
    const message = db.messages.find((m) => m.id === id);

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (status) {
      message.status = status;
    }
    if (notes !== undefined) {
      message.notes = notes;
    }

    await saveDb(db);
    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "UPDATE_MESSAGE",
      "CONTACT_MESSAGE",
      { messageId: id, newStatus: status },
      id
    );

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Update message error:", error);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized - Super Admin required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Message ID required" }, { status: 400 });
    }

    const db = await getDb();
    const index = db.messages.findIndex((m) => m.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    db.messages.splice(index, 1);
    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "DELETE_MESSAGE",
      "CONTACT_MESSAGE",
      { messageId: id },
      id
    );

    return NextResponse.json({ success: true, message: "Message removed" });
  } catch (error) {
    console.error("Delete message error:", error);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
