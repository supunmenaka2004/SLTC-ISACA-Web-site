"use client";

import { useEffect, useState } from "react";
import {
  ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  Filter,
  FileImage,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { MediaAsset } from "@/server/db/schema";

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Upload modal states
  const [uploadCategory, setUploadCategory] = useState<MediaAsset["category"]>("general");
  const [altText, setAltText] = useState("");

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const loadMedia = async () => {
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setAssets(data.assets || []);
      }
    } catch {
      showToast("Failed to load media assets", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("File size exceeds maximum allowed size of 5MB", "error");
      return;
    }

    setUploading(true);
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64Data,
            filename: file.name,
            altText: altText.trim() || file.name,
            category: uploadCategory,
          }),
        });

        if (res.ok) {
          showToast(`Asset '${file.name}' uploaded successfully!`);
          setAltText("");
          await loadMedia();
        } else {
          const errData = await res.json();
          showToast(errData.error || "Upload failed", "error");
        }
      } catch {
        showToast("Error processing image file upload", "error");
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    };

    reader.readAsDataURL(file);
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete media asset '${name}'?`)) return;

    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Media asset deleted!");
        await loadMedia();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to delete asset", "error");
      }
    } catch {
      showToast("Network error deleting asset", "error");
    }
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesCat = selectedCategory === "all" || asset.category === selectedCategory;
    const matchesQ =
      !searchQuery.trim() ||
      asset.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.altText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQ;
  });

  if (loading) {
    return (
      <div className="py-20 flex justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono uppercase tracking-wider mb-2">
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>CENTRALIZED ASSET VAULT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Shared Media Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Store, optimize, search, and manage global brand logos, committee photos, project assets, and research imagery.
          </p>
        </div>

        {/* Upload Button */}
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 cursor-pointer">
          <Upload className="w-3.5 h-3.5" />
          <span>{uploading ? "Processing Upload..." : "Upload New Image"}</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-lg border text-xs font-medium flex items-center gap-2.5 ${
            message.type === "success"
              ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
              : "bg-rose-950/60 border-rose-500/40 text-rose-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Upload Metadata Settings Box */}
      <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono">Upload Category:</span>
          <select
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value as MediaAsset["category"])}
            className="bg-[#030712] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="general">General Asset</option>
            <option value="logo">Brand Logo / Favicon</option>
            <option value="hero">Hero Background</option>
            <option value="team">Team Photo</option>
            <option value="committee">Committee Photo</option>
            <option value="project">Project Preview</option>
            <option value="news">News Illustration</option>
          </select>
        </div>

        <div className="flex-1">
          <input
            type="text"
            placeholder="Optional Alt Text description for next upload..."
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="w-full bg-[#030712] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          {[
            { id: "all", label: "All" },
            { id: "logo", label: "Logos" },
            { id: "hero", label: "Hero" },
            { id: "team", label: "Team" },
            { id: "committee", label: "Committee" },
            { id: "project", label: "Projects" },
            { id: "news", label: "News" },
            { id: "general", label: "General" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedCategory === cat.id
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search media assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#030712] border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-[#090f1d] border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between group hover:border-cyan-500/50 transition-all shadow-md"
            >
              {/* Thumbnail Container */}
              <div className="w-full aspect-[4/3] bg-[#030712] relative overflow-hidden flex items-center justify-center p-2">
                <img
                  src={asset.url}
                  alt={asset.altText}
                  className="w-full h-full object-contain transition-transform group-hover:scale-105"
                />
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-white/10 text-[9px] font-mono text-cyan-300 uppercase">
                  {asset.category}
                </span>
              </div>

              {/* Asset Details */}
              <div className="p-3 border-t border-slate-800/80 space-y-2">
                <p className="text-xs font-semibold text-white truncate" title={asset.originalName}>
                  {asset.originalName}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{(asset.size / 1024).toFixed(0)} KB</span>
                  <span className="truncate max-w-[80px]">{asset.mimeType.split("/")[1]?.toUpperCase()}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => copyUrl(asset.url, asset.id)}
                    className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    {copiedId === asset.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === asset.id ? "Copied" : "Copy URL"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(asset.id, asset.originalName)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-slate-500 text-xs">
            No media assets found matching the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
