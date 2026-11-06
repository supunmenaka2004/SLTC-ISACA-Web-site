"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Save,
  CheckCircle,
  Eye,
  Sliders,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import DirectImageUpload from "@/components/admin/DirectImageUpload";
import WordColorEditor from "@/components/admin/WordColorEditor";
import IconPicker from "@/components/admin/IconPicker";
import WordColoredHeading from "@/components/WordColoredHeading";
import { HomepageConfig } from "@/server/db/schema";

export default function HomePageManagement() {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
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
        const res = await fetch("/api/admin/content/home");
        if (res.ok) {
          const data = await res.json();
          setConfig(data.homepage);
        }
      } catch {
        showToast("Failed to load homepage configuration", "error");
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
      const res = await fetch("/api/admin/content/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        showToast("Homepage configuration updated and live!");
      } else {
        showToast("Failed to update homepage", "error");
      }
    } catch {
      showToast("Network error updating homepage", "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (key: keyof HomepageConfig["visibleSections"]) => {
    if (!config) return;
    setConfig({
      ...config,
      visibleSections: {
        ...config.visibleSections,
        [key]: !config.visibleSections[key],
      },
    });
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
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
            <span>HOMEPAGE ARCHITECTURE &amp; SECTIONS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Homepage Content Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure hero titles, CTA destinations, section display ordering, and visibility toggles.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Homepage Changes"}</span>
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

      {/* Section 1: Hero Banner Settings */}
      <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white">Hero Section Content</h3>
          <span className="text-[10px] font-mono uppercase text-cyan-400">Live Preview Enabled</span>
        </div>

        {/* Live Hero Banner Preview Box */}
        <div className="p-6 rounded-xl bg-[#02060d] border border-slate-800 relative overflow-hidden text-center">
          <div className="inline-block px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono uppercase tracking-wider mb-3">
            HERO PREVIEW (HOMEPAGE)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-[#13b5d1] via-[#29b99b] to-[#78be20] bg-clip-text text-transparent">
              {config.heroTitle || "ISACA"}
            </span>{" "}
            <span className="text-white font-semibold">
              {config.heroHighlight || "Student Group"}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-md mx-auto">
            {config.heroSubtitle || "Sri Lanka Technology Campus"}
          </p>
          <div className="mt-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/30">
              {config.heroCtaText || "MORE DETAILS"} →
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
              Brand Title (Gradient Highlight)
            </label>
            <input
              type="text"
              value={config.heroTitle}
              onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
              className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
              Title Suffix
            </label>
            <input
              type="text"
              value={config.heroHighlight}
              onChange={(e) => setConfig({ ...config, heroHighlight: e.target.value })}
              className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
            Hero Subtitle / University Affiliation
          </label>
          <input
            type="text"
            value={config.heroSubtitle}
            onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
            className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
              CTA Button Label
            </label>
            <input
              type="text"
              value={config.heroCtaText}
              onChange={(e) => setConfig({ ...config, heroCtaText: e.target.value })}
              className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
              CTA Button Destination Link
            </label>
            <input
              type="text"
              value={config.heroCtaLink}
              onChange={(e) => setConfig({ ...config, heroCtaLink: e.target.value })}
              className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Section Visibility Toggles */}
      <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
          Homepage Section Visibility Toggles
        </h3>
        <p className="text-xs text-slate-400">
          Easily enable or disable sections without modifying source code.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { key: "hero", label: "1. Ambient Hero Canvas" },
            { key: "aboutPreview", label: "2. Who We Are: About Preview" },
            { key: "teamPreview", label: "3. Executive Board Showcase" },
            { key: "committeePreview", label: "4. Leadership & Committee Preview" },
            { key: "eventsPreview", label: "5. Upcoming Events Carousel" },
            { key: "newsPreview", label: "6. Latest Cyber News Desk" },
          ].map((sec) => {
            const isVisible = config.visibleSections[sec.key as keyof HomepageConfig["visibleSections"]];
            return (
              <div
                key={sec.key}
                onClick={() => toggleSection(sec.key as keyof HomepageConfig["visibleSections"])}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                  isVisible
                    ? "bg-[#0d1527] border-cyan-500/50 text-white"
                    : "bg-[#030712] border-slate-800 text-slate-500"
                }`}
              >
                <span className="text-xs font-semibold">{sec.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                    isVisible ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {isVisible ? "Active" : "Hidden"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: About Preview Settings */}
      <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <h3 className="text-sm font-bold text-white">
              About Preview Section Content
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize the &quot;Who are we&quot; section on the homepage, including word-by-word title colors.
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase text-cyan-400">Live Preview Enabled</span>
        </div>

        {/* Live About Section Preview Box */}
        <div className="p-5 rounded-xl bg-[#060c18] border border-slate-800 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider font-semibold">
              {config.aboutPreviewKicker || "ABOUT OUR ORGANIZATION"}
            </span>
            <h4 className="text-xl font-bold mt-1">
              <WordColoredHeading
                words={config.aboutPreviewTitleWords}
                rawText={config.aboutPreviewTitle || "Who We Are"}
                defaultColor="#ffffff"
                highlightColor="#22d3ee"
              />
            </h4>
            <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
              {config.aboutPreviewDesc || "Organization mission preview..."}
            </p>
            <span className="inline-block mt-3 text-xs text-cyan-400 font-semibold">
              {config.aboutPreviewCtaText || "READ MORE ABOUT OUR MISSION"} →
            </span>
          </div>

          <div className="w-full md:w-48 h-32 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.aboutPreviewImage || "/about.jpg"}
              alt="About Section Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/about.jpg";
              }}
            />
          </div>
        </div>

        {/* Word-by-Word Title Styler for About Preview */}
        <WordColorEditor
          label="About Section Heading & Word Colors"
          value={config.aboutPreviewTitle || "Who We Are"}
          words={config.aboutPreviewTitleWords}
          defaultColor="#ffffff"
          helperText="Type the topic heading and click each word to assign individual colors (White, Cyan, Emerald, Sky, Gradient, etc.)."
          onChange={(newText, newWords) =>
            setConfig({
              ...config,
              aboutPreviewTitle: newText,
              aboutPreviewTitleWords: newWords,
            })
          }
        />

        {/* Direct Image Upload Component */}
        <DirectImageUpload
          value={config.aboutPreviewImage}
          onChange={(url) => setConfig({ ...config, aboutPreviewImage: url })}
          category="general"
          label="About Section Showcase Image"
          aspectHint="Landscape image recommended, up to 5MB"
        />

        {/* About Section Kicker Icon Picker */}
        <IconPicker
          label="About Section Kicker Icon"
          value={config.aboutPreviewIcon || "ShieldCheck"}
          onChange={(newIcon) => setConfig({ ...config, aboutPreviewIcon: newIcon })}
          helperText="Icon displayed next to the kicker label above 'Who We Are'"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
              Editorial Kicker Label (e.g. ABOUT OUR ORGANIZATION)
            </label>
            <input
              type="text"
              value={config.aboutPreviewKicker}
              onChange={(e) => setConfig({ ...config, aboutPreviewKicker: e.target.value })}
              className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
              Read More CTA Button Text
            </label>
            <input
              type="text"
              value={config.aboutPreviewCtaText}
              onChange={(e) => setConfig({ ...config, aboutPreviewCtaText: e.target.value })}
              className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
            Description Paragraph
          </label>
          <textarea
            rows={3}
            value={config.aboutPreviewDesc}
            onChange={(e) => setConfig({ ...config, aboutPreviewDesc: e.target.value })}
            className="w-full bg-[#030712] border border-slate-700 rounded-lg p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Section 4: Executive Board Showcase (Team) */}
      <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white">
            3. Executive Board Showcase (Team Preview)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage the section kicker icon, label, heading, subtitle, and word colors for the executive board on the homepage.
          </p>
        </div>

        {/* Team Kicker Icon Picker */}
        <IconPicker
          label="Executive Board Kicker Icon"
          value={config.teamPreviewIcon || "Users"}
          onChange={(newIcon) => setConfig({ ...config, teamPreviewIcon: newIcon })}
          helperText="Icon displayed next to the kicker label above 'Meet Our Team'"
        />

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
            Executive Board Kicker / Label (e.g. EXECUTIVE BOARD 2026/2027)
          </label>
          <input
            type="text"
            value={config.teamPreviewKicker ?? "EXECUTIVE BOARD 2026/2027"}
            onChange={(e) => setConfig({ ...config, teamPreviewKicker: e.target.value })}
            placeholder="EXECUTIVE BOARD 2026/2027"
            className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>

        {/* Team Section Heading */}
        <WordColorEditor
          label="Team Showcase Heading & Word Colors"
          value={config.teamPreviewTitle || "Meet Our Team"}
          words={config.teamPreviewTitleWords}
          defaultColor="#ffffff"
          helperText="Customize the heading and individual word colors for the executive team section."
          onChange={(newText, newWords) =>
            setConfig({
              ...config,
              teamPreviewTitle: newText,
              teamPreviewTitleWords: newWords,
            })
          }
        />

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
            Team Section Subtitle / Description
          </label>
          <textarea
            rows={2}
            value={config.teamPreviewDesc ?? "The student leaders driving ISACA Student Group forward with innovation, ethics, and professional development."}
            onChange={(e) => setConfig({ ...config, teamPreviewDesc: e.target.value })}
            className="w-full bg-[#030712] border border-slate-700 rounded-lg p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Section 5: Leadership & Committee Showcase */}
      <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white">
            4. Leadership & Committee Preview
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage the committee kicker icon, label, CTA button, heading, subtitle, and word colors on the homepage.
          </p>
        </div>

        {/* Committee Kicker Icon Picker */}
        <IconPicker
          label="Committee Kicker Icon"
          value={config.committeePreviewIcon || "Award"}
          onChange={(newIcon) => setConfig({ ...config, committeePreviewIcon: newIcon })}
          helperText="Icon displayed next to the kicker label above 'Our Committee'"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
              Committee Kicker / Label (e.g. LEADERSHIP &amp; COMMITTEE)
            </label>
            <input
              type="text"
              value={config.committeePreviewKicker ?? "LEADERSHIP & COMMITTEE"}
              onChange={(e) => setConfig({ ...config, committeePreviewKicker: e.target.value })}
              placeholder="LEADERSHIP & COMMITTEE"
              className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
              Roster CTA Link Label
            </label>
            <input
              type="text"
              value={config.committeePreviewCtaText ?? "VIEW FULL COMMITTEE ROSTER"}
              onChange={(e) => setConfig({ ...config, committeePreviewCtaText: e.target.value })}
              placeholder="VIEW FULL COMMITTEE ROSTER"
              className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        {/* Committee Section Heading */}
        <WordColorEditor
          label="Committee Section Heading & Word Colors"
          value={config.committeePreviewTitle || "Our Committee"}
          words={config.committeePreviewTitleWords}
          defaultColor="#ffffff"
          helperText="Customize the heading and word colors for the committee preview section on the homepage."
          onChange={(newText, newWords) =>
            setConfig({
              ...config,
              committeePreviewTitle: newText,
              committeePreviewTitleWords: newWords,
            })
          }
        />

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
            Committee Section Subtitle / Description
          </label>
          <textarea
            rows={2}
            value={config.committeePreviewDesc ?? "Meet the student officials guiding ISACA Student Group towards academic excellence, technical innovation, and digital security awareness."}
            onChange={(e) => setConfig({ ...config, committeePreviewDesc: e.target.value })}
            className="w-full bg-[#030712] border border-slate-700 rounded-lg p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Section 6: Upcoming Events Carousel Section */}
      <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white">
            5. Upcoming Events Carousel Section
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage the events kicker icon, label, CTA button, heading, subtitle, and word colors on the homepage.
          </p>
        </div>

        {/* Events Kicker Icon Picker */}
        <IconPicker
          label="Events Kicker Icon"
          value={config.eventsPreviewIcon || "Calendar"}
          onChange={(newIcon) => setConfig({ ...config, eventsPreviewIcon: newIcon })}
          helperText="Icon displayed next to the kicker label above 'Upcoming Events'"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
              Events Kicker / Label (e.g. EVENTS &amp; ACTIVITIES)
            </label>
            <input
              type="text"
              value={config.eventsPreviewKicker ?? "EVENTS & ACTIVITIES"}
              onChange={(e) => setConfig({ ...config, eventsPreviewKicker: e.target.value })}
              placeholder="EVENTS & ACTIVITIES"
              className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
              View All Events CTA Link Text
            </label>
            <input
              type="text"
              value={config.eventsPreviewCtaText ?? "VIEW ALL EVENTS"}
              onChange={(e) => setConfig({ ...config, eventsPreviewCtaText: e.target.value })}
              placeholder="VIEW ALL EVENTS"
              className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        {/* Events Section Heading */}
        <WordColorEditor
          label="Events Carousel Heading & Word Colors"
          value={config.eventsPreviewTitle || "Upcoming Events"}
          words={config.eventsPreviewTitleWords}
          defaultColor="#ffffff"
          helperText="Customize the heading for the featured upcoming events carousel."
          onChange={(newText, newWords) =>
            setConfig({
              ...config,
              eventsPreviewTitle: newText,
              eventsPreviewTitleWords: newWords,
            })
          }
        />

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
            Events Section Subtitle / Description
          </label>
          <textarea
            rows={2}
            value={config.eventsPreviewDesc ?? "Discover our workshops, seminars, and student competitions."}
            onChange={(e) => setConfig({ ...config, eventsPreviewDesc: e.target.value })}
            className="w-full bg-[#030712] border border-slate-700 rounded-lg p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Section 7: Cyber News Desk Section */}
      <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white">
            6. Latest Cyber News Desk Section
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage the news kicker icon, label, CTA button, heading, subtitle, and word colors on the homepage.
          </p>
        </div>

        {/* Cyber News Kicker Icon Picker */}
        <IconPicker
          label="Cyber News Kicker Icon"
          value={config.newsPreviewIcon || "Newspaper"}
          onChange={(newIcon) => setConfig({ ...config, newsPreviewIcon: newIcon })}
          helperText="Icon displayed next to the kicker label above 'Latest Cyber News'"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
              News Kicker / Label (e.g. INSIGHTS &amp; PUBLICATIONS)
            </label>
            <input
              type="text"
              value={config.newsPreviewKicker ?? "INSIGHTS & PUBLICATIONS"}
              onChange={(e) => setConfig({ ...config, newsPreviewKicker: e.target.value })}
              placeholder="INSIGHTS & PUBLICATIONS"
              className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
              View All News CTA Link Text
            </label>
            <input
              type="text"
              value={config.newsPreviewCtaText ?? "VIEW ALL NEWS"}
              onChange={(e) => setConfig({ ...config, newsPreviewCtaText: e.target.value })}
              placeholder="VIEW ALL NEWS"
              className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        {/* Cyber News Section Heading */}
        <WordColorEditor
          label="Cyber News Desk Heading & Word Colors"
          value={config.newsPreviewTitle || "Latest Cyber News"}
          words={config.newsPreviewTitleWords}
          defaultColor="#ffffff"
          helperText="Customize the heading for the latest cyber news desk preview."
          onChange={(newText, newWords) =>
            setConfig({
              ...config,
              newsPreviewTitle: newText,
              newsPreviewTitleWords: newWords,
            })
          }
        />

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
            News Section Subtitle / Description
          </label>
          <textarea
            rows={2}
            value={config.newsPreviewDesc ?? "Stay informed about the latest developments in cybersecurity, technology and digital security."}
            onChange={(e) => setConfig({ ...config, newsPreviewDesc: e.target.value })}
            className="w-full bg-[#030712] border border-slate-700 rounded-lg p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>
    </div>
  );
}
