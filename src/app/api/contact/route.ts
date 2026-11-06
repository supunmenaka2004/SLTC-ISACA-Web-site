import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb, saveDb } from "@/server/db";
import { getSession } from "@/server/auth";
import { ContactMessage } from "@/server/db/schema";

// Public message submission
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, studentId, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const db = await getDb();
    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 120),
      studentId: studentId ? studentId.trim().slice(0, 30) : undefined,
      subject: subject ? subject.trim().slice(0, 200) : undefined,
      message: message.trim().slice(0, 2000),
      status: "unread",
      createdAt: new Date().toISOString(),
    };

    db.messages.unshift(newMessage);
    await saveDb(db);

    return NextResponse.json({ success: true, message: "Inquiry received successfully", id: newMessage.id }, { status: 201 });
  } catch (error) {
    console.error("Public contact submit error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}

// Admin message retrieval
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const query = searchParams.get("q")?.toLowerCase();

    const db = await getDb();
    let messages = db.messages;

    if (status && status !== "all") {
      messages = messages.filter((m) => m.status === status);
    }

    if (query) {
      messages = messages.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.email.toLowerCase().includes(query) ||
          m.message.toLowerCase().includes(query) ||
          (m.studentId && m.studentId.toLowerCase().includes(query))
      );
    }

    const unreadCount = db.messages.filter((m) => m.status === "unread").length;

    return NextResponse.json({
      messages,
      unreadCount,
      totalCount: db.messages.length,
    });
  } catch (error) {
    console.error("Admin fetch messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
