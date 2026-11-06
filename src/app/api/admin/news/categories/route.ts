import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/server/db";
import { getSession, logAudit } from "@/server/auth";

export async function GET() {
  try {
    const db = await getDb();
    const categoriesWithCounts = db.newsCategories.map((name) => ({
      name,
      count: db.news.filter((a) => a.category === name).length,
    }));

    return NextResponse.json({ categories: categoriesWithCounts });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "CHIEF_EDITOR" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Chief Editor or Super Admin permission required" }, { status: 403 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const trimmed = name.trim();
    const db = await getDb();

    if (db.newsCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }

    db.newsCategories.push(trimmed);
    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "CREATE_CATEGORY",
      "NEWS_CATEGORY",
      { categoryName: trimmed }
    );

    return NextResponse.json({ success: true, category: trimmed }, { status: 201 });
  } catch (error) {
    console.error("Add category error:", error);
    return NextResponse.json({ error: "Failed to add category" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "CHIEF_EDITOR" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Chief Editor or Super Admin permission required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json({ error: "Category name required" }, { status: 400 });
    }

    const db = await getDb();
    const index = db.newsCategories.findIndex((c) => c.toLowerCase() === name.toLowerCase());

    if (index === -1) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    db.newsCategories.splice(index, 1);
    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "DELETE_CATEGORY",
      "NEWS_CATEGORY",
      { categoryName: name }
    );

    return NextResponse.json({ success: true, message: `Category '${name}' deleted` });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
