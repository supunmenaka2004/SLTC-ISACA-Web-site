import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb, saveDb } from "@/server/db";
import { getSession, hashPassword, logAudit } from "@/server/auth";
import { AdminUser, UserRole } from "@/server/db/schema";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "CHIEF_EDITOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const db = await getDb();
    // Exclude passwordHash and salt
    const sanitizedUsers = db.users.map(({ id, email, name, role, status, avatar, createdAt, lastLoginAt }) => ({
      id,
      email,
      name,
      role,
      status,
      avatar,
      createdAt,
      lastLoginAt,
    }));

    return NextResponse.json({ users: sanitizedUsers });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Only Super Admin can create accounts" }, { status: 403 });
    }

    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "Email, password, name, and role are required" }, { status: 400 });
    }

    const validRoles: UserRole[] = ["SUPER_ADMIN", "CHIEF_EDITOR", "NEWS_EDITOR", "NEWS_CONTRIBUTOR"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role assigned" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    const db = await getDb();
    const existing = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      return NextResponse.json({ error: "A user account with this email already exists" }, { status: 400 });
    }

    const { hash, salt } = hashPassword(password);
    const newUser: AdminUser = {
      id: `usr-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
      email: email.trim().toLowerCase(),
      passwordHash: hash,
      salt,
      name: name.trim(),
      role,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "CREATE_USER",
      "USER_MANAGEMENT",
      { createdEmail: newUser.email, role: newUser.role, name: newUser.name },
      newUser.id
    );

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          status: newUser.status,
          createdAt: newUser.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Super Admin privileges required" }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, role, status, newPassword } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const db = await getDb();
    const user = db.users.find((u) => u.id === id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Protection against removing all super admins or demoting self
    if (user.id === session.userId && role && role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "You cannot demote your own Super Admin account" }, { status: 400 });
    }
    if (user.id === session.userId && status === "INACTIVE") {
      return NextResponse.json({ error: "You cannot deactivate your own account" }, { status: 400 });
    }

    if (name) user.name = name.trim();
    if (role) user.role = role;
    if (status) user.status = status;

    if (newPassword && newPassword.length >= 8) {
      const { hash, salt } = hashPassword(newPassword);
      user.passwordHash = hash;
      user.salt = salt;
    }

    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "UPDATE_USER",
      "USER_MANAGEMENT",
      { updatedEmail: user.email, role: user.role, status: user.status },
      user.id
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
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
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    if (id === session.userId) {
      return NextResponse.json({ error: "You cannot delete your own active administrator account" }, { status: 400 });
    }

    const db = await getDb();
    const index = db.users.findIndex((u) => u.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const targetUser = db.users[index];
    db.users.splice(index, 1);
    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "DELETE_USER",
      "USER_MANAGEMENT",
      { deletedEmail: targetUser.email, deletedName: targetUser.name },
      id
    );

    return NextResponse.json({ success: true, message: `Account '${targetUser.email}' deleted` });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
