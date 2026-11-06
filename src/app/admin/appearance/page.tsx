"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Palette,
  Type,
  ImageIcon,
  Sparkles,
  Save,
  RotateCcw,
  History,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Sliders,
  Layers,
  Check,
  ShieldAlert,
} from "lucide-react";
import { ThemeConfiguration, ThemeVersion, ThemeColors } from "@/server/db/schema";
import { defaultTheme } from "@/server/db/defaults";
import DirectImageUpload from "@/components/admin/DirectImageUpload";
import GradientBuilder from "@/components/admin/GradientBuilder";

// Helper for WCAG contrast calculation
function hexToLuminance(hex: string): number {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  if (isNaN(num)) return 0.5;
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const srgb = [r, g, b].map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function calculateContrastRatio(foregroundHex: string, backgroundHex: string): number {
  try {
    const l1 = hexToLuminance(foregroundHex);
    const l2 = hexToLuminance(backgroundHex);
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return (brightest + 0.05) / (darkest + 0.05);
  } catch {
    return 4.5;
  }
}

export default function AppearanceStudioPage() {
  const [activeTab, setActiveTab] = useState<"colors" | "gradients" | "typography" | "logos" | "components" | "preview" | "history">("colors");
  const [liveTheme, setLiveTheme] = useState<ThemeConfiguration>(defaultTheme);
  const [draftTheme, setDraftTheme] = useState<ThemeConfiguration>(defaultTheme);
  const [versions, setVersions] = useState<ThemeVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function loadTheme() {
      try {
        const res = await fetch("/api/admin/appearance");
        if (res.ok) {
          const data = await res.json();
          setLiveTheme(data.theme);
          setDraftTheme(data.themeDraft || data.theme);
          setVersions(data.versions || []);
        }
      } catch (err) {
        console.error("Failed to load theme data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTheme();
  }, []);

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setDraftTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value,
      },
    }));
  };

  const handleTypographyChange = (key: string, value: string) => {
    setDraftTheme((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        [key]: value,
      },
    }));
  };

  const handleComponentChange = (key: string, value: unknown) => {
    setDraftTheme((prev) => ({
      ...prev,
      components: {
        ...prev.components,
        [key]: value,
      },
    }));
  };

  const handleLogoChange = (key: string, value: unknown) => {
    setDraftTheme((prev) => ({
      ...prev,
      logo: {
        ...prev.logo,
        [key]: value,
      },
    }));
  };

  const saveDraft = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/appearance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftTheme),
      });
      if (res.ok) {
        showNotification("Theme draft saved successfully!");
      } else {
        const data = await res.json();
        showNotification(data.error || "Failed to save draft", "error");
      }
    } catch {
      showNotification("Network error saving draft", "error");
    } finally {
      setSaving(false);
    }
  };

  const publishTheme = async () => {
    if (!confirm("Are you sure you want to publish these theme changes to the public website?")) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/admin/appearance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "PUBLISH", label: `Version ${(liveTheme.version || 1) + 1} Update` }),
      });
      if (res.ok) {
        const data = await res.json();
        setLiveTheme(data.theme);
        setDraftTheme(data.theme);
        setVersions(data.versions || []);
        showNotification("Theme successfully published to live website!");
      } else {
        const data = await res.json();
        showNotification(data.error || "Failed to publish theme", "error");
      }
    } catch {
      showNotification("Network error publishing theme", "error");
    } finally {
      setPublishing(false);
    }
  };

  const restoreBaseline = async () => {
    if (!confirm("Reset draft theme to original SLTC ISACA institutional default?")) return;
    try {
      const res = await fetch("/api/admin/appearance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RESTORE_DEFAULT" }),
      });
      if (res.ok) {
        const data = await res.json();
        setDraftTheme(data.themeDraft);
        showNotification("Draft reset to baseline theme");
      }
    } catch {
      showNotification("Failed to restore baseline", "error");
    }
  };

  const rollbackVersion = async (versionId: string) => {
    if (!confirm("Rollback live theme to this previous snapshot?")) return;
    try {
      const res = await fetch("/api/admin/appearance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ROLLBACK", versionId }),
      });
      if (res.ok) {
        const data = await res.json();
        setLiveTheme(data.theme);
        setDraftTheme(data.theme);
        setVersions(data.versions || []);
        showNotification("Theme rolled back successfully!");
      }
    } catch {
      showNotification("Failed to rollback version", "error");
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono uppercase tracking-widest">Loading Appearance Studio Engine...</span>
      </div>
    );
  }

  // Calculate Contrast: Body Text on Main Background
  const bodyContrast = calculateContrastRatio(draftTheme.colors.textWhite, draftTheme.colors.bgMain);
  const accentContrast = calculateContrastRatio(draftTheme.colors.cyanAccent, draftTheme.colors.bgMain);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Studio Header & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-purple-950/80 border border-purple-500/30 text-purple-300 text-[10px] font-mono uppercase tracking-wider mb-2">
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            <span>VISUAL BRANDING &amp; DESIGN SYSTEM STUDIO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Appearance &amp; Theme Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visually customize logos, typography, color palettes, and component aesthetics with live preview and version rollback.
          </p>
        </div>

        {/* Global Studio Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={restoreBaseline}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>

          <button
            onClick={saveDraft}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving Draft..." : "Save as Draft"}</span>
          </button>

          <button
            onClick={publishTheme}
            disabled={publishing}
            className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{publishing ? "Publishing Live..." : "Publish Live Changes"}</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {message && (
        <div
          className={`p-3.5 rounded-lg border text-xs font-medium flex items-center gap-2.5 animate-in fade-in duration-200 ${
            message.type === "success"
              ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
              : "bg-rose-950/60 border-rose-500/40 text-rose-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Studio Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 font-mono text-xs">
        {[
          { id: "colors", label: "Color Palette & Contrast", icon: Palette },
          { id: "gradients", label: "Gradient Studio & Builder", icon: Sparkles },
          { id: "typography", label: "Typography System", icon: Type },
          { id: "logos", label: "Logo & Brand Assets", icon: ImageIcon },
          { id: "components", label: "Component Styling", icon: Sliders },
          { id: "preview", label: "Live Interactive Preview", icon: Eye },
          { id: "history", label: "Version History", icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: COLOR PALETTE & CONTRAST */}
      {activeTab === "colors" && (
        <div className="space-y-6">
          {/* Contrast Diagnostic Card */}
          <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>Accessibility &amp; Contrast Diagnostics (WCAG 2.1)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-[#0d1527] border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">White Text on Main Background</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Calculated Ratio: {bodyContrast.toFixed(2)}:1</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded text-[11px] font-bold font-mono ${
                    bodyContrast >= 7
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                      : bodyContrast >= 4.5
                      ? "bg-yellow-950 text-yellow-300 border border-yellow-500/40"
                      : "bg-rose-950 text-rose-300 border border-rose-500/40"
                  }`}
                >
                  {bodyContrast >= 7 ? "AAA Pass" : bodyContrast >= 4.5 ? "AA Pass" : "Fail (Low Contrast)"}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0d1527] border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Cyan Accent on Main Background</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Calculated Ratio: {accentContrast.toFixed(2)}:1</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded text-[11px] font-bold font-mono ${
                    accentContrast >= 4.5
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                      : "bg-yellow-950 text-yellow-300 border border-yellow-500/40"
                  }`}
                >
                  {accentContrast >= 4.5 ? "AA Pass" : "Accent Contrast"}
                </span>
              </div>
            </div>
          </div>

          {/* Color Tokens Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: "bgMain", label: "Page Main Background", desc: "Overall dark body canvas" },
              { key: "bgSection", label: "Section Background", desc: "Alternating page section fills" },
              { key: "bgCard", label: "Surface / Card Background", desc: "Cards, containers, modals" },
              { key: "cyanAccent", label: "Primary Cyan Accent", desc: "Highlights, tags, glowing borders" },
              { key: "skyAccent", label: "Sky Accent", desc: "Secondary gradient nodes" },
              { key: "emeraldAccent", label: "Emerald Accent", desc: "Success badges & audit stamps" },
              { key: "textWhite", label: "Headings & Primary Text", desc: "H1, H2, prominent labels" },
              { key: "textSlate", label: "Body Text", desc: "Article paragraphs & descriptions" },
              { key: "textMuted", label: "Muted Metadata", desc: "Timestamps, kickers, small captions" },
              { key: "borderCard", label: "Card Border Base", desc: "Default border styling" },
              { key: "borderHover", label: "Hover Glow Border", desc: "Interactive hover borders" },
              { key: "buttonBg", label: "Button Background", desc: "Primary CTA fill" },
              { key: "buttonText", label: "Button Text Color", desc: "CTA button font color" },
              { key: "buttonBorder", label: "Button Border Color", desc: "CTA button border accent" },
            ].map((token) => {
              const currentColor = draftTheme.colors[token.key as keyof ThemeColors] || "#ffffff";
              return (
                <div key={token.key} className="p-4 rounded-xl bg-[#090f1d] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{token.label}</p>
                      <p className="text-[10px] text-slate-400">{token.desc}</p>
                    </div>
                    {/* Visual Color Preview Chip */}
                    <div
                      className="w-8 h-8 rounded-lg border border-white/20 shadow-inner shrink-0"
                      style={{ backgroundColor: currentColor }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentColor.startsWith("#") ? currentColor : "#00f0ff"}
                      onChange={(e) => handleColorChange(token.key as keyof ThemeColors, e.target.value)}
                      className="w-10 h-9 p-0.5 rounded border border-slate-700 bg-slate-900 cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={currentColor}
                      onChange={(e) => handleColorChange(token.key as keyof ThemeColors, e.target.value)}
                      className="flex-1 bg-[#030712] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TYPOGRAPHY SYSTEM */}
      {activeTab === "typography" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Font Family Config */}
            <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white mb-2">Font Families</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Heading Font Family</label>
                <select
                  value={draftTheme.typography.headingFont}
                  onChange={(e) => handleTypographyChange("headingFont", e.target.value)}
                  className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans (Default)</option>
                  <option value="Geist, sans-serif">Geist Sans</option>
                  <option value="Inter, system-ui, sans-serif">Inter</option>
                  <option value="Roboto, sans-serif">Roboto</option>
                  <option value="Outfit, sans-serif">Outfit</option>
                  <option value="JetBrains Mono, monospace">JetBrains Mono (Technical)</option>
                  <option value="system-ui, -apple-system, sans-serif">System Native Sans</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Body Font Family</label>
                <select
                  value={draftTheme.typography.bodyFont}
                  onChange={(e) => handleTypographyChange("bodyFont", e.target.value)}
                  className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans (Default)</option>
                  <option value="Geist, sans-serif">Geist Sans</option>
                  <option value="Inter, system-ui, sans-serif">Inter</option>
                  <option value="Roboto, sans-serif">Roboto</option>
                  <option value="system-ui, -apple-system, sans-serif">System Native Sans</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Base Font Sizing</label>
                <div className="grid grid-cols-4 gap-2">
                  {["14px", "15px", "16px", "17px"].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => handleTypographyChange("baseFontSize", sz)}
                      className={`py-2 text-xs font-mono rounded border transition-colors ${
                        draftTheme.typography.baseFontSize === sz
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Weights, Line Heights & Spacing */}
            <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white mb-2">Metrics &amp; Line Heights</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Heading Weight</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "SemiBold (600)", val: "600" },
                    { label: "Bold (700)", val: "700" },
                    { label: "ExtraBold (800)", val: "800" },
                  ].map((w) => (
                    <button
                      key={w.val}
                      type="button"
                      onClick={() => handleTypographyChange("headingWeight", w.val)}
                      className={`py-2 text-xs rounded border transition-colors ${
                        draftTheme.typography.headingWeight === w.val
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500 font-bold"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Paragraph Line Height</label>
                <div className="grid grid-cols-4 gap-2">
                  {["1.5", "1.6", "1.75", "1.85"].map((lh) => (
                    <button
                      key={lh}
                      type="button"
                      onClick={() => handleTypographyChange("lineHeight", lh)}
                      className={`py-2 text-xs font-mono rounded border transition-colors ${
                        draftTheme.typography.lineHeight === lh
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                    >
                      {lh}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Heading Letter Spacing</label>
                <div className="grid grid-cols-4 gap-2">
                  {["-0.04em", "-0.02em", "0em", "0.02em"].map((ls) => (
                    <button
                      key={ls}
                      type="button"
                      onClick={() => handleTypographyChange("letterSpacing", ls)}
                      className={`py-2 text-xs font-mono rounded border transition-colors ${
                        draftTheme.typography.letterSpacing === ls
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                    >
                      {ls}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Live Typography Hierarchy Preview */}
          <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 space-y-4">
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">Live Hierarchy Scale Sample</h4>
            <div
              className="p-6 rounded-lg bg-[#030712] border border-slate-800 space-y-3"
              style={{
                fontFamily: draftTheme.typography.bodyFont,
                lineHeight: draftTheme.typography.lineHeight,
              }}
            >
              <h1
                style={{
                  fontFamily: draftTheme.typography.headingFont,
                  fontWeight: draftTheme.typography.headingWeight,
                  letterSpacing: draftTheme.typography.letterSpacing,
                }}
                className="text-3xl sm:text-4xl text-white"
              >
                ISACA Student Group H1 Headline
              </h1>
              <h2
                style={{
                  fontFamily: draftTheme.typography.headingFont,
                  fontWeight: draftTheme.typography.headingWeight,
                }}
                className="text-xl sm:text-2xl text-cyan-300"
              >
                H2 Section Subtitle: Empowering Cybersecurity Excellence
              </h2>
              <p className="text-slate-300 text-base max-w-2xl">
                This is a real-time preview of the body typography. The quick brown fox jumps over the lazy dog to verify legibility, font rendering, line heights, and glyph spacing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOGO & BRAND ASSETS */}
      {activeTab === "logos" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Full Brand Logo */}
            <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">Full Brand Logo</h3>
              <div className="p-4 rounded-lg bg-[#030712] border border-slate-800 flex items-center justify-center min-h-[120px]">
                <img
                  src={draftTheme.logo.mainLogo || "/isaca_full_logo.png"}
                  alt="Full Brand Logo"
                  style={{ height: draftTheme.logo.logoHeight || 52 }}
                  className="w-auto object-contain"
                />
              </div>

              {/* Direct Main Logo Uploader */}
              <DirectImageUpload
                value={draftTheme.logo.mainLogo}
                onChange={(url) => handleLogoChange("mainLogo", url)}
                category="logo"
                label="Upload Full Brand Logo"
                aspectHint="PNG or SVG with transparent background"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Logo Height: {draftTheme.logo.logoHeight}px
                </label>
                <input
                  type="range"
                  min="32"
                  max="80"
                  value={draftTheme.logo.logoHeight}
                  onChange={(e) => handleLogoChange("logoHeight", parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Transparent Navbar Emblem */}
            <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">Transparent Navbar Emblem &amp; Favicon</h3>
              <div className="p-4 rounded-lg bg-[#030712] border border-slate-800 flex items-center justify-center min-h-[120px]">
                <img
                  src={draftTheme.logo.transparentLogo || "/isaca_transparent.png"}
                  alt="Transparent Emblem"
                  style={{ height: draftTheme.logo.logoHeight || 52 }}
                  className="w-auto object-contain"
                />
              </div>

              {/* Direct Transparent Emblem Uploader */}
              <DirectImageUpload
                value={draftTheme.logo.transparentLogo}
                onChange={(url) => handleLogoChange("transparentLogo", url)}
                category="logo"
                label="Upload Transparent Emblem"
                aspectHint="PNG or SVG, transparent background"
              />

              {/* Direct Favicon Uploader */}
              <DirectImageUpload
                value={draftTheme.logo.favicon}
                onChange={(url) => handleLogoChange("favicon", url)}
                category="logo"
                label="Upload Favicon"
                aspectHint=".ico or square .png"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPONENT STYLING */}
      {activeTab === "components" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white mb-2">Button Geometry</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Corner Radius</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "none", label: "Sharp" },
                    { id: "sm", label: "Small" },
                    { id: "md", label: "Medium" },
                    { id: "full", label: "Pill" },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleComponentChange("buttonRadius", r.id)}
                      className={`py-2 text-xs rounded border transition-colors ${
                        draftTheme.components.buttonRadius === r.id
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500 font-bold"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-300 mb-2">Preview Button</label>
                <button
                  type="button"
                  style={{
                    backgroundColor: draftTheme.colors.buttonBg,
                    color: draftTheme.colors.buttonText,
                    borderColor: draftTheme.colors.buttonBorder,
                    borderRadius:
                      draftTheme.components.buttonRadius === "none"
                        ? "0"
                        : draftTheme.components.buttonRadius === "sm"
                        ? "4px"
                        : draftTheme.components.buttonRadius === "md"
                        ? "8px"
                        : "9999px",
                  }}
                  className="px-6 py-3 border text-xs font-bold uppercase tracking-widest transition-all shadow-md"
                >
                  MORE DETAILS
                </button>
              </div>
            </div>

            <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white mb-2">Card &amp; Surface Effects</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Card Corner Radius</label>
                <div className="grid grid-cols-3 gap-2">
                  {["0.5rem", "0.875rem", "1.25rem"].map((rad) => (
                    <button
                      key={rad}
                      type="button"
                      onClick={() => handleComponentChange("cardRadius", rad)}
                      className={`py-2 text-xs font-mono rounded border transition-colors ${
                        draftTheme.components.cardRadius === rad
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500 font-bold"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                    >
                      {rad}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#030712] border border-slate-800">
                <div>
                  <p className="text-xs font-semibold text-white">Cyan Ambient Glow on Hover</p>
                  <p className="text-[10px] text-slate-400">Radiant cyber neon box shadow</p>
                </div>
                <input
                  type="checkbox"
                  checked={draftTheme.components.cardGlow}
                  onChange={(e) => handleComponentChange("cardGlow", e.target.checked)}
                  className="w-4 h-4 accent-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LIVE INTERACTIVE PREVIEW */}
      {activeTab === "preview" && (
        <div className="space-y-6">
          <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Simulated Public Page Preview with Current Draft Tokens</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300 font-mono">
                Draft State Active
              </span>
            </div>

            {/* Rendered Live Simulation Canvas */}
            <div
              className="p-8 rounded-2xl border transition-all space-y-12"
              style={{
                backgroundColor: draftTheme.colors.bgMain,
                borderColor: draftTheme.colors.borderCard,
                fontFamily: draftTheme.typography.bodyFont,
              }}
            >
              {/* Simulated Hero Section */}
              <div className="text-center py-8 space-y-4 max-w-2xl mx-auto">
                <h1
                  style={{
                    fontFamily: draftTheme.typography.headingFont,
                    fontWeight: draftTheme.typography.headingWeight,
                    letterSpacing: draftTheme.typography.letterSpacing,
                    color: draftTheme.colors.textWhite,
                  }}
                  className="text-4xl font-extrabold"
                >
                  <span style={{ color: draftTheme.colors.cyanAccent }}>ISACA</span> Student Group
                </h1>
                <p style={{ color: draftTheme.colors.textSlate }} className="text-sm">
                  Sri Lanka Technology Campus – Official Cybersecurity Student Chapter
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    style={{
                      backgroundColor: draftTheme.colors.buttonBg,
                      color: draftTheme.colors.buttonText,
                      borderColor: draftTheme.colors.buttonBorder,
                      borderRadius:
                        draftTheme.components.buttonRadius === "none"
                          ? "0"
                          : draftTheme.components.buttonRadius === "sm"
                          ? "4px"
                          : draftTheme.components.buttonRadius === "md"
                          ? "8px"
                          : "9999px",
                    }}
                    className="px-6 py-2.5 border text-xs font-bold uppercase tracking-wider"
                  >
                    MORE DETAILS
                  </button>
                </div>
              </div>

              {/* Simulated News Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/60">
                <div
                  className="p-5 border transition-all"
                  style={{
                    backgroundColor: draftTheme.colors.bgCard,
                    borderColor: draftTheme.colors.borderCard,
                    borderRadius: draftTheme.components.cardRadius,
                  }}
                >
                  <span
                    style={{
                      color: draftTheme.colors.cyanAccent,
                      borderColor: draftTheme.colors.borderCard,
                    }}
                    className="text-[10px] uppercase font-bold tracking-wider font-mono px-2 py-0.5 rounded border inline-block mb-3"
                  >
                    AI Security Advisory
                  </span>
                  <h3
                    style={{
                      fontFamily: draftTheme.typography.headingFont,
                      fontWeight: draftTheme.typography.headingWeight,
                      color: draftTheme.colors.textWhite,
                    }}
                    className="text-base font-bold mb-2"
                  >
                    AI-powered attacks on critical infrastructure threat model
                  </h3>
                  <p style={{ color: draftTheme.colors.textSlate }} className="text-xs leading-relaxed">
                    Analyzing autonomous exploitation pipelines and incident response defenses for enterprise networks.
                  </p>
                </div>

                <div
                  className="p-5 border transition-all"
                  style={{
                    backgroundColor: draftTheme.colors.bgCard,
                    borderColor: draftTheme.colors.borderCard,
                    borderRadius: draftTheme.components.cardRadius,
                  }}
                >
                  <span
                    style={{
                      color: draftTheme.colors.emeraldAccent,
                      borderColor: draftTheme.colors.borderCard,
                    }}
                    className="text-[10px] uppercase font-bold tracking-wider font-mono px-2 py-0.5 rounded border inline-block mb-3"
                  >
                    Threat Intelligence
                  </span>
                  <h3
                    style={{
                      fontFamily: draftTheme.typography.headingFont,
                      fontWeight: draftTheme.typography.headingWeight,
                      color: draftTheme.colors.textWhite,
                    }}
                    className="text-base font-bold mb-2"
                  >
                    Critical Remote Code Execution advisory in cloud gateways
                  </h3>
                  <p style={{ color: draftTheme.colors.textSlate }} className="text-xs leading-relaxed">
                    Mitigation guidelines and threat hunting queries released by the security operations research desk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: THEME VERSION HISTORY & ROLLBACK */}
      {activeTab === "history" && (
        <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <span>Theme Version Snapshots &amp; Rollback</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Each publish action captures an immutable snapshot. Restore any previous theme state with one click.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-semibold">
              Live Version: v{liveTheme.version}
            </span>
          </div>

          <div className="space-y-3">
            {versions.map((ver) => (
              <div
                key={ver.id}
                className="p-4 rounded-lg bg-[#0d1527] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
                      v{ver.version}
                    </span>
                    <span className="text-sm font-semibold text-white">{ver.label}</span>
                    {ver.version === liveTheme.version && (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold font-mono">
                        CURRENT LIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Saved by <strong className="text-slate-300">{ver.savedBy}</strong> on{" "}
                    {new Date(ver.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {ver.version !== liveTheme.version && (
                    <button
                      type="button"
                      onClick={() => rollbackVersion(ver.id)}
                      className="px-3 py-1.5 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                    >
                      Rollback to this Version
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* TAB: GRADIENT STUDIO & BUILDER ENVIRONMENT */}
      {activeTab === "gradients" && (
        <div className="space-y-6">
          <GradientBuilder
            initialGradient="linear-gradient(90deg, #13b5d1 0%, #29b99b 50%, #78be20 100%)"
            sampleText="Who are we"
            onApply={(css) => {
              showNotification("Custom gradient created and copied! You can paste it into any heading or theme setting.");
              navigator.clipboard?.writeText(css);
            }}
            onClose={() => setActiveTab("colors")}
          />
        </div>
      )}
    </div>
  );
}
