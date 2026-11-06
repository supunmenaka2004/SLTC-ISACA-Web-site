import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb, saveDb, defaultTheme } from "@/server/db";
import { getSession, logAudit } from "@/server/auth";
import { ThemeVersion } from "@/server/db/schema";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    return NextResponse.json({
      theme: db.theme,
      themeDraft: db.themeDraft || db.theme,
      versions: db.themeVersions,
    });
  } catch (error) {
    console.error("Get theme error:", error);
    return NextResponse.json({ error: "Failed to load theme configuration" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Super Admin privileges required to edit branding" }, { status: 403 });
    }

    const body = await request.json();
    const { colors, typography, components, logo } = body;

    const db = await getDb();

    db.themeDraft = {
      ...db.themeDraft,
      colors: colors || db.themeDraft.colors,
      typography: typography || db.themeDraft.typography,
      components: components || db.themeDraft.components,
      logo: logo || db.themeDraft.logo,
      isDraft: true,
      updatedAt: new Date().toISOString(),
    };

    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "SAVE_THEME_DRAFT",
      "THEME",
      { note: "Theme draft updated with new styling tokens" }
    );

    return NextResponse.json({
      success: true,
      themeDraft: db.themeDraft,
    });
  } catch (error) {
    console.error("Save theme draft error:", error);
    return NextResponse.json({ error: "Failed to update theme draft" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Super Admin privileges required" }, { status: 403 });
    }

    const body = await request.json();
    const { action, versionId, label } = body;

    const db = await getDb();

    if (action === "PUBLISH") {
      const nextVersion = (db.theme.version || 1) + 1;
      const publishedTheme = {
        ...db.themeDraft,
        isDraft: false,
        version: nextVersion,
        updatedAt: new Date().toISOString(),
      };

      db.theme = publishedTheme;
      db.themeDraft = { ...publishedTheme, isDraft: true };

      // Create snapshot version history
      const versionEntry: ThemeVersion = {
        id: `ver-${nextVersion}-${crypto.randomBytes(3).toString("hex")}`,
        version: nextVersion,
        label: label?.trim() || `Theme Version ${nextVersion}`,
        config: publishedTheme,
        savedBy: session.name,
        createdAt: new Date().toISOString(),
      };

      db.themeVersions.unshift(versionEntry);
      // Keep up to 20 snapshots
      if (db.themeVersions.length > 20) {
        db.themeVersions = db.themeVersions.slice(0, 20);
      }

      await saveDb(db);
      await logAudit(
        { userId: session.userId, userName: session.name, userRole: session.role },
        "PUBLISH_THEME",
        "THEME",
        { version: nextVersion, label: versionEntry.label }
      );

      return NextResponse.json({
        success: true,
        message: "Theme changes published live to public website",
        theme: db.theme,
        versions: db.themeVersions,
      });
    }

    if (action === "RESTORE_DEFAULT") {
      db.themeDraft = { ...defaultTheme, isDraft: true, updatedAt: new Date().toISOString() };
      await saveDb(db);

      await logAudit(
        { userId: session.userId, userName: session.name, userRole: session.role },
        "RESTORE_DEFAULT_THEME",
        "THEME",
        { note: "Reset draft theme to original institutional baseline" }
      );

      return NextResponse.json({
        success: true,
        message: "Draft reset to original default theme",
        themeDraft: db.themeDraft,
      });
    }

    if (action === "ROLLBACK") {
      if (!versionId) {
        return NextResponse.json({ error: "Version ID required for rollback" }, { status: 400 });
      }

      const snapshot = db.themeVersions.find((v) => v.id === versionId);
      if (!snapshot) {
        return NextResponse.json({ error: "Theme version not found" }, { status: 404 });
      }

      const nextVersion = (db.theme.version || 1) + 1;
      const restored = {
        ...snapshot.config,
        version: nextVersion,
        isDraft: false,
        updatedAt: new Date().toISOString(),
      };

      db.theme = restored;
      db.themeDraft = { ...restored, isDraft: true };

      const rollbackRecord: ThemeVersion = {
        id: `ver-${nextVersion}-${crypto.randomBytes(3).toString("hex")}`,
        version: nextVersion,
        label: `Rollback to Version ${snapshot.version} (${snapshot.label})`,
        config: restored,
        savedBy: session.name,
        createdAt: new Date().toISOString(),
      };

      db.themeVersions.unshift(rollbackRecord);
      await saveDb(db);

      await logAudit(
        { userId: session.userId, userName: session.name, userRole: session.role },
        "ROLLBACK_THEME",
        "THEME",
        { restoredFrom: snapshot.version, newVersion: nextVersion }
      );

      return NextResponse.json({
        success: true,
        message: `Successfully rolled back to Version ${snapshot.version}`,
        theme: db.theme,
        themeDraft: db.themeDraft,
        versions: db.themeVersions,
      });
    }

    if (action === "DISCARD_DRAFT") {
      db.themeDraft = { ...db.theme, isDraft: true, updatedAt: new Date().toISOString() };
      await saveDb(db);
      return NextResponse.json({
        success: true,
        message: "Unsaved theme draft discarded",
        themeDraft: db.themeDraft,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Theme action error:", error);
    return NextResponse.json({ error: "Failed to process theme action" }, { status: 500 });
  }
}
