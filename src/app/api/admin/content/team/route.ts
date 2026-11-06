import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb, saveDb } from "@/server/db";
import { getSession, logAudit } from "@/server/auth";
import { TeamMember } from "@/server/db/schema";
import { syncTeamToCommittee } from "@/server/db/syncMembers";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const team = (db.team || []).sort((a, b) => (a.order || 0) - (b.order || 0));

    return NextResponse.json({ team });
  } catch (error) {
    console.error("Get team error:", error);
    return NextResponse.json({ error: "Failed to load team members" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "CONTENT_ADMIN")) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const body = await request.json();
    const { name, role, image, description, socialLinks, order } = body;

    if (!name || !role) {
      return NextResponse.json({ error: "Name and role/designation are required" }, { status: 400 });
    }

    const db = await getDb();
    if (!db.team) db.team = [];

    const newMember: TeamMember = {
      id: `team-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`,
      name: name.trim(),
      role: role.trim(),
      image: image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      description: description?.trim() || "",
      socialLinks: {
        linkedin: socialLinks?.linkedin || "",
        instagram: socialLinks?.instagram || "",
        github: socialLinks?.github || "",
      },
      order: typeof order === "number" ? order : db.team.length + 1,
      archived: false,
      visible: true,
    };

    db.team.push(newMember);
    syncTeamToCommittee(db, newMember, "CREATE");
    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "CREATE_TEAM_MEMBER",
      "TEAM",
      { name: newMember.name, role: newMember.role },
      newMember.id
    );

    return NextResponse.json({ success: true, member: newMember }, { status: 201 });
  } catch (error) {
    console.error("Create team member error:", error);
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "CONTENT_ADMIN")) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const body = await request.json();
    const db = await getDb();
    if (!db.team) db.team = [];

    // Check if it's a reorder batch request
    if (Array.isArray(body.reorder)) {
      body.reorder.forEach((item: { id: string; order: number }) => {
        const found = db.team.find((m) => m.id === item.id);
        if (found) {
          found.order = item.order;
          syncTeamToCommittee(db, found, "UPDATE");
        }
      });
      await saveDb(db);
      return NextResponse.json({ success: true, team: db.team });
    }

    const { id, name, role, image, description, socialLinks, order, visible } = body;
    if (!id) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
    }

    const member = db.team.find((m) => m.id === id);
    if (!member) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    if (name) member.name = name.trim();
    if (role) member.role = role.trim();
    if (image !== undefined) member.image = image;
    if (description !== undefined) member.description = description.trim();
    if (socialLinks) member.socialLinks = { ...member.socialLinks, ...socialLinks };
    if (typeof order === "number") member.order = order;
    if (visible !== undefined) member.visible = visible;

    syncTeamToCommittee(db, member, "UPDATE");
    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "UPDATE_TEAM_MEMBER",
      "TEAM",
      { name: member.name },
      member.id
    );

    return NextResponse.json({ success: true, member });
  } catch (error) {
    console.error("Update team member error:", error);
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
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
    if (!db.team) db.team = [];

    const index = db.team.findIndex((m) => m.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const removed = db.team.splice(index, 1)[0];
    syncTeamToCommittee(db, removed, "DELETE");
    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "DELETE_TEAM_MEMBER",
      "TEAM",
      { name: removed.name },
      id
    );

    return NextResponse.json({ success: true, message: "Member removed" });
  } catch (error) {
    console.error("Delete team member error:", error);
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
  }
}
