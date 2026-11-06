"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Save,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Target,
  Eye,
  BookOpen,
} from "lucide-react";
import DirectImageUpload from "@/components/admin/DirectImageUpload";
import { AboutContentConfig } from "@/server/db/schema";

export default function AboutUsManagement() {
  const [config, setConfig] = useState<AboutContentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/content/about");
        if (res.ok) {
          const data = await res.json();
          setConfig(data.aboutContent);
        }
      } catch {
        showToast("Failed to load about content", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setSaving(true);

    try {
      const res = await fetch("/api/admin/content/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        showToast("About Us content updated successfully!");
      } else {
        showToast("Failed to update about content", "error");
      }
    } catch {
      showToast("Network error updating about content", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !config) {
    return (
      <div className="py-20 flex justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-950/80 border border-blue-500/30 text-blue-300 text-[10px] font-mono uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>ORGANIZATIONAL GOVERNANCE &amp; PROFILE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            About Us Content Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage institutional mission, vision, university affiliation details, and core organizational values.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save About Us Content"}</span>
        </button>
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
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Live About Preview */}
      <div className="bg-[#060c18] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Live Page Header &amp; Mission Preview
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Real-time render</span>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-block px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono uppercase">
            About Us
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {config.title || "About ISACA Student Group"}
          </h2>
          <h3 className="text-sm font-semibold text-cyan-300">
            {config.subtitle || "Empowering Students for a Secure Digital World"}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
            {config.mainIntro || "Overview statement..."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-[#0a1122] border border-slate-800">
              <span className="text-xs font-bold text-cyan-400 block mb-1">Our Mission</span>
              <p className="text-[11px] text-slate-400 line-clamp-2">{config.mission || "Mission statement..."}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#0a1122] border border-slate-800">
              <span className="text-xs font-bold text-purple-400 block mb-1">Our Vision</span>
              <p className="text-[11px] text-slate-400 line-clamp-2">{config.vision || "Vision statement..."}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Introductions */}
      <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Main Institutional Overview</h3>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
            Page Title
          </label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => setConfig({ ...config, title: e.target.value })}
            className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
            Introductory Headline
          </label>
          <input
            type="text"
            value={config.subtitle}
            onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
            className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
            Primary Introduction Paragraph
          </label>
          <textarea
            rows={3}
            value={config.mainIntro}
            onChange={(e) => setConfig({ ...config, mainIntro: e.target.value })}
            className="w-full bg-[#030712] border border-slate-700 rounded-lg p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
            Secondary Initiatives &amp; Workshop Paragraph
          </label>
          <textarea
            rows={3}
            value={config.secondaryIntro}
            onChange={(e) => setConfig({ ...config, secondaryIntro: e.target.value })}
            className="w-full bg-[#030712] border border-slate-700 rounded-lg p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase font-mono">
            <Target className="w-4 h-4" />
            <span>Mission Statement</span>
          </div>
          <textarea
            rows={4}
            value={config.mission}
            onChange={(e) => setConfig({ ...config, mission: e.target.value })}
            className="w-full bg-[#030712] border border-slate-700 rounded-lg p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase font-mono">
            <Eye className="w-4 h-4" />
            <span>Vision Statement</span>
          </div>
          <textarea
            rows={4}
            value={config.vision}
            onChange={(e) => setConfig({ ...config, vision: e.target.value })}
            className="w-full bg-[#030712] border border-slate-700 rounded-lg p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Affiliation Points */}
      <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">University Affiliation Points</h3>
          <button
            type="button"
            onClick={() =>
              setConfig({
                ...config,
                affiliationPoints: [...config.affiliationPoints, ""],
              })
            }
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Point</span>
          </button>
        </div>

        <div className="space-y-2">
          {config.affiliationPoints.map((pt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={pt}
                onChange={(e) => {
                  const updated = [...config.affiliationPoints];
                  updated[idx] = e.target.value;
                  setConfig({ ...config, affiliationPoints: updated });
                }}
                className="flex-1 bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() =>
                  setConfig({
                    ...config,
                    affiliationPoints: config.affiliationPoints.filter((_, i) => i !== idx),
                  })
                }
                className="p-2 text-slate-500 hover:text-rose-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
