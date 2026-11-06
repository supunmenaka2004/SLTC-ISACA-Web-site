import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getDb, saveDb } from "@/server/db";
import { getSession, logAudit } from "@/server/auth";
import { MediaAsset } from "@/server/db/schema";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q")?.toLowerCase();

    const db = await getDb();
    let assets = [...db.media];

    if (category && category !== "all") {
      assets = assets.filter((m) => m.category === category);
    }

    if (query) {
      assets = assets.filter(
        (m) =>
          m.filename.toLowerCase().includes(query) ||
          m.altText.toLowerCase().includes(query) ||
          m.originalName.toLowerCase().includes(query)
      );
    }

    assets.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return NextResponse.json({ assets, total: db.media.length });
  } catch (error) {
    console.error("Get media error:", error);
    return NextResponse.json({ error: "Failed to load media assets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { base64Data, filename, altText, category } = body;

    if (!base64Data || !filename) {
      return NextResponse.json({ error: "Base64 image data and filename are required" }, { status: 400 });
    }

    // Role check: News Contributor cannot upload or overwrite global logos or site brand assets
    if (session.role === "NEWS_CONTRIBUTOR" && category === "logo") {
      return NextResponse.json({ error: "News Contributors do not have permission to manage global logos" }, { status: 403 });
    }

    // Parse base64
    const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: "Invalid base64 image data format" }, { status: 400 });
    }

    const mimeType = matches[1].toLowerCase();
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/x-icon",
    ];

    if (!allowedMimeTypes.includes(mimeType)) {
      return NextResponse.json({ error: `File type '${mimeType}' is not supported. Use JPG, PNG, WEBP, or SVG.` }, { status: 400 });
    }

    const buffer = Buffer.from(matches[2], "base64");
    // Limit to 5MB
    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image file exceeds maximum permitted size of 5MB" }, { status: 400 });
    }

    // Ensure upload dir exists
    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    // Sanitize extension and filename
    const ext = path.extname(filename).toLowerCase() || (mimeType === "image/png" ? ".png" : ".jpg");
    const sanitizedBase = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueFilename = `${sanitizedBase}-${Date.now()}-${crypto.randomBytes(3).toString("hex")}${ext}`;
    const targetPath = path.join(UPLOADS_DIR, uniqueFilename);

    await fs.writeFile(targetPath, buffer);

    const assetUrl = `/uploads/${uniqueFilename}`;
    const db = await getDb();

    const newAsset: MediaAsset = {
      id: `med-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
      filename: uniqueFilename,
      originalName: filename,
      mimeType,
      size: buffer.length,
      url: assetUrl,
      altText: altText?.trim() || filename,
      category: category || "general",
      uploadedBy: session.name,
      uploadedAt: new Date().toISOString(),
    };

    db.media.unshift(newAsset);
    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "UPLOAD_MEDIA",
      "MEDIA_LIBRARY",
      { filename: uniqueFilename, size: buffer.length, category: newAsset.category },
      newAsset.id
    );

    return NextResponse.json({ success: true, asset: newAsset }, { status: 201 });
  } catch (error) {
    console.error("Upload media error:", error);
    return NextResponse.json({ error: "Failed to upload media file" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Media ID required" }, { status: 400 });
    }

    const db = await getDb();
    const index = db.media.findIndex((m) => m.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Media asset not found" }, { status: 404 });
    }

    const asset = db.media[index];

    // Contributor cannot delete non-news or assets they didn't upload
    if (session.role === "NEWS_CONTRIBUTOR" && asset.uploadedBy !== session.name) {
      return NextResponse.json({ error: "You can only delete media you uploaded" }, { status: 403 });
    }

    // Try to remove from disk if inside uploads
    if (asset.url.startsWith("/uploads/")) {
      try {
        const filePath = path.join(process.cwd(), "public", asset.url);
        await fs.unlink(filePath);
      } catch {
        // Continue if file already missing on disk
      }
    }

    db.media.splice(index, 1);
    await saveDb(db);

    await logAudit(
      { userId: session.userId, userName: session.name, userRole: session.role },
      "DELETE_MEDIA",
      "MEDIA_LIBRARY",
      { filename: asset.filename, id },
      id
    );

    return NextResponse.json({ success: true, message: "Media asset removed" });
  } catch (error) {
    console.error("Delete media error:", error);
    return NextResponse.json({ error: "Failed to delete media asset" }, { status: 500 });
  }
}
