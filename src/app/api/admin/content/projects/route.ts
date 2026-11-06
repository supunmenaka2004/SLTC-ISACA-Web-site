import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb, saveDb } from "@/server/db";
import { getSession, logAudit } from "@/server/auth";
import { ProjectItem } from "@/server/db/schema";

export async function GET() {
  try {
    const db = await getDb();
    const sorted = [...db.projects].sort((a, b) => (a.order || 0) - (b.order || 0));
    return NextResponse.json({ projects: sorted });
  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json({ error: "Failed to load projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Super Admin privileges required" }, { status: 403 });
    }

    const body = await request.json();
    const { name, category, description, status, technologies, githubUrl, demoUrl, image, order } = body;

    if (!name || !category || !description) {
      return NextResponse.json({ error: "Name, category, and description are required" }, { status: 400 });
    }

    const db = await getDb();
    const newProject: ProjectItem = {
      id: `proj-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`,
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      status: (status as ProjectItem["status"]) || "Active",
      technologies: Array.isArray(technologies) ? technologies : (technologies || "").split(",").map((t: string) => t.trim()).filter(Boolean),
      githubUrl: githubUrl?.trim() || undefined,
      demoUrl: demoUrl?.trim() || undefined,
      image: image?.trim() || undefined,
      order: order ?? db.projects.length + 1,
      archived: false,
    };

    db.projects.push(newProject);
    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "CREATE_PROJECT",
      "PROJECTS",
      { name: newProject.name, category: newProject.category },
      newProject.id
    );

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Super Admin privileges required" }, { status: 403 });
    }

    const body = await request.json();
    const { id, projects, ...updates } = body;

    const db = await getDb();

    // Batch reorder
    if (Array.isArray(projects)) {
      projects.forEach((p: { id: string; order: number }) => {
        const found = db.projects.find((proj) => proj.id === p.id);
        if (found) found.order = p.order;
      });
      await saveDb(db);
      return NextResponse.json({ success: true, message: "Projects order updated" });
    }

    if (!id) {
      return NextResponse.json({ error: "Project ID required" }, { status: 400 });
    }

    const project = db.projects.find((p) => p.id === id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (updates.technologies && !Array.isArray(updates.technologies)) {
      updates.technologies = (updates.technologies as string).split(",").map((t: string) => t.trim()).filter(Boolean);
    }

    Object.assign(project, updates);
    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "UPDATE_PROJECT",
      "PROJECTS",
      { name: project.name, id: project.id },
      project.id
    );

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
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
      return NextResponse.json({ error: "Project ID required" }, { status: 400 });
    }

    const db = await getDb();
    const index = db.projects.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const removed = db.projects.splice(index, 1)[0];
    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "DELETE_PROJECT",
      "PROJECTS",
      { name: removed.name, id },
      id
    );

    return NextResponse.json({ success: true, message: `Project '${removed.name}' removed` });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
