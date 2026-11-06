"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, RefreshCw, CheckCircle, Image as ImageIcon } from "lucide-react";

interface DirectImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  category?: "logo" | "hero" | "committee" | "project" | "team" | "general";
  label?: string;
  aspectHint?: string;
  className?: string;
}

export default function DirectImageUpload({
  value,
  onChange,
  category = "general",
  label = "Upload Image",
  aspectHint = "PNG, JPG, WebP up to 5MB",
  className = "",
}: DirectImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/x-icon"];
    if (!validTypes.includes(file.type)) {
      setError("Supported formats: JPG, PNG, WebP, SVG, ICO");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Read as base64 data url for the API
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        if (!base64Data) {
          setError("Failed to read image file.");
          setUploading(false);
          return;
        }

        const res = await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64Data,
            filename: file.name,
            altText: file.name.replace(/\.[^/.]+$/, ""),
            category,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.asset?.url) {
            onChange(data.asset.url);
          } else {
            setError("Upload failed to return URL.");
          }
        } else {
          const data = await res.json();
          setError(data.error || "Upload failed");
        }
        setUploading(false);
      };

      reader.onerror = () => {
        setError("Error reading file.");
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch {
      setError("Network error while uploading.");
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            {label}
          </label>
          <span className="text-[11px] text-slate-400 font-mono">{aspectHint}</span>
        </div>
      )}

      {value ? (
        /* Image Preview State with Replace / Remove controls */
        <div className="relative group border border-slate-700/80 bg-[#060c18] rounded-xl p-3 flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0 flex items-center justify-center relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                // fallback if broken
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Image Ready</span>
            </div>
            <p className="text-xs text-slate-400 font-mono truncate mt-0.5" title={value}>
              {value}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${uploading ? "animate-spin" : ""}`} />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                disabled={uploading}
                className="px-2.5 py-1 text-xs rounded bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone State */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-cyan-400 bg-cyan-950/20"
              : "border-slate-700/80 hover:border-cyan-500/60 bg-[#060c18] hover:bg-slate-900/60"
          } ${uploading ? "opacity-60 pointer-events-none" : ""}`}
        >
          {uploading ? (
            <div className="py-2 flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-cyan-300 font-medium">Uploading &amp; Processing...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5 py-1">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mb-1">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-white">
                Click to upload or drag &amp; drop
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                Supports JPG, PNG, WebP up to 5MB
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 mt-1 font-mono">
          ✕ {error}
        </p>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/x-icon"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
        className="hidden"
      />
    </div>
  );
}
