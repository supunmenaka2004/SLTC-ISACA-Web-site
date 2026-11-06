import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb, saveDb } from "@/server/db";
import { getSession, logAudit } from "@/server/auth";
import { CommitteeMember } from "@/server/db/schema";
import { syncCommitteeToTeam } from "@/server/db/syncMembers";

export async function GET() {
  try {
    const db = await getDb();
    const sorted = [...db.committee].sort((a, b) => (a.order || 0) - (b.order || 0));
    return NextResponse.json({ committee: sorted });
  } catch (error) {
    console.error("Get committee error:", error);
    return NextResponse.json({ error: "Failed to load committee members" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Super Admin privileges required" }, { status: 403 });
    }

    const body = await request.json();
    const { name, position, initials, category, bio, linkedin, github, instagram, email, image, order } = body;

    if (!name || !position || !category) {
      return NextResponse.json({ error: "Name, position, and category are required" }, { status: 400 });
    }

    const db = await getDb();
    const newMember: CommitteeMember = {
      id: `com-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`,
      name: name.trim(),
      position: position.trim(),
      initials: (initials || name.split(" ").map((n: string) => n[0]).join("")).toUpperCase().slice(0, 3),
      category: category as CommitteeMember["category"],
      bio: bio?.trim() || "",
      linkedin: linkedin?.trim() || "https://linkedin.com",
      github: github?.trim() || undefined,
      instagram: instagram?.trim() || undefined,
      email: email?.trim() || "committee@isacaclub.org",
      image: image?.trim() || undefined,
      order: order ?? db.committee.length + 1,
      archived: false,
    };

    db.committee.push(newMember);
    syncCommitteeToTeam(db, newMember, "CREATE");
    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "CREATE_COMMITTEE_MEMBER",
      "COMMITTEE",
      { name: newMember.name, position: newMember.position },
      newMember.id
    );

    return NextResponse.json({ success: true, member: newMember }, { status: 201 });
  } catch (error) {
    console.error("Create committee member error:", error);
    return NextResponse.json({ error: "Failed to create committee member" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Super Admin privileges required" }, { status: 403 });
    }

    const body = await request.json();
    const { id, members, ...updates } = body;

    const db = await getDb();

    // Batch reorder support
    if (Array.isArray(members)) {
      members.forEach((m: { id: string; order: number }) => {
        const found = db.committee.find((c) => c.id === m.id);
        if (found) {
          found.order = m.order;
          syncCommitteeToTeam(db, found, "UPDATE");
        }
      });
      await saveDb(db);
      return NextResponse.json({ success: true, message: "Committee display order updated" });
    }

    if (!id) {
      return NextResponse.json({ error: "Member ID required" }, { status: 400 });
    }

    const member = db.committee.find((m) => m.id === id);
    if (!member) {
      return NextResponse.json({ error: "Committee member not found" }, { status: 404 });
    }

    Object.assign(member, updates);
    syncCommitteeToTeam(db, member, "UPDATE");
    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "UPDATE_COMMITTEE_MEMBER",
      "COMMITTEE",
      { name: member.name, position: member.position },
      member.id
    );

    return NextResponse.json({ success: true, member });
  } catch (error) {
    console.error("Update committee member error:", error);
    return NextResponse.json({ error: "Failed to update committee member" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Super Admin privileges required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Member ID required" }, { status: 400 });
    }

    const db = await getDb();
    const index = db.committee.findIndex((m) => m.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Committee member not found" }, { status: 404 });
    }

    const removed = db.committee.splice(index, 1)[0];
    syncCommitteeToTeam(db, removed, "DELETE");
    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "DELETE_COMMITTEE_MEMBER",
      "COMMITTEE",
      { name: removed.name, id },
      id
    );

    return NextResponse.json({ success: true, message: `Member '${removed.name}' removed` });
  } catch (error) {
    console.error("Delete committee member error:", error);
    return NextResponse.json({ error: "Failed to delete committee member" }, { status: 500 });
  }
}
