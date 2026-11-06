"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Save,
  CheckCircle,
  AlertCircle,
  Globe,
  Share2,
  Mail,
  Phone,
  MapPin,
  Palette,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import DirectImageUpload from "@/components/admin/DirectImageUpload";
import { SiteSettings } from "@/server/db/schema";

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
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
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data.settings);
        }
      } catch {
        showToast("Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        showToast("Site settings & SEO configurations updated!");
      } else {
        showToast("Failed to update settings", "error");
      }
    } catch {
      showToast("Network error updating settings", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
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
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono uppercase tracking-wider mb-2">
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
            <span>GLOBAL METADATA &amp; CONNECTIVITY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            SEO &amp; Website Global Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure search engine indexing, social sharing Open Graph tags, canonical URLs, and official contact channels.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
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

      {/* SEO Metadata Box */}
      <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>Search Engine Optimization (SEO) &amp; Open Graph</span>
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">Website Title Tag</label>
          <input
            type="text"
            value={settings.siteTitle}
            onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
            className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">Tagline</label>
          <input
            type="text"
            value={settings.tagline}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">Meta Description</label>
          <textarea
            rows={3}
            value={settings.description}
            onChange={(e) => setSettings({ ...settings, description: e.target.value })}
            className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">Canonical URL</label>
            <input
              type="text"
              value={settings.canonicalUrl}
              onChange={(e) => setSettings({ ...settings, canonicalUrl: e.target.value })}
              className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Direct Open Graph Image Upload */}
        <DirectImageUpload
          value={settings.ogImage}
          onChange={(url) => setSettings({ ...settings, ogImage: url })}
          category="general"
          label="Open Graph Sharing Banner Image"
          aspectHint="1200x630px recommended, up to 5MB"
        />
      </div>

      {/* Appearance & Branding Quick Access */}
      <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-cyan-400" />
            <span>Appearance &amp; Branding Studio</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Customize logos, color tokens with WCAG contrast validation, and typography with real-time preview.
          </p>
        </div>
        <Link
          href="/admin/appearance"
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0 transition-colors shadow-sm"
        >
          Open Appearance Studio →
        </Link>
      </div>

      {/* Official Contact Channels */}
      <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
          <Mail className="w-4 h-4 text-emerald-400" />
          <span>Official Public Contact Information</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">Official Contact Email</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">Campus Phone</label>
            <input
              type="text"
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">Official Campus Address</label>
          <input
            type="text"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Social Media Links */}
      <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-purple-400" />
          <span>Official Social Media Channels</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">LinkedIn Page URL</label>
            <input
              type="text"
              value={settings.socials.linkedin || ""}
              onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, linkedin: e.target.value } })}
              className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">GitHub Organization URL</label>
            <input
              type="text"
              value={settings.socials.github || ""}
              onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, github: e.target.value } })}
              className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">YouTube Channel URL</label>
            <input
              type="text"
              value={settings.socials.youtube || ""}
              onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, youtube: e.target.value } })}
              className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">Instagram Page URL</label>
            <input
              type="text"
              value={settings.socials.instagram || ""}
              onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, instagram: e.target.value } })}
              className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
