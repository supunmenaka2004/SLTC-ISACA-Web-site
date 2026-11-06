"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  Mail,
  Palette,
  ArrowRight,
  ShieldCheck,
  Home,
  FileText,
  Settings,
  Image as ImageIcon,
  History,
  Clock,
  ExternalLink,
} from "lucide-react";

interface DashboardData {
  teamCount: number;
  committeeCount: number;
  projectsCount: number;
  unreadMessagesCount: number;
  themeVersion: number;
  recentAudit: Array<{
    id: string;
    userName: string;
    action: string;
    resource: string;
    timestamp: string;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [teamRes, commRes, projRes, msgRes, themeRes, auditRes] = await Promise.all([
          fetch("/api/admin/content/team"),
          fetch("/api/admin/content/committee"),
          fetch("/api/admin/content/projects"),
          fetch("/api/contact?status=unread"),
          fetch("/api/admin/appearance"),
          fetch("/api/admin/audit"),
        ]);

        const [team, comm, proj, msg, theme, audit] = await Promise.all([
          teamRes.ok ? teamRes.json() : { team: [] },
          commRes.ok ? commRes.json() : { committee: [] },
          projRes.ok ? projRes.json() : { projects: [] },
          msgRes.ok ? msgRes.json() : { messages: [] },
          themeRes.ok ? themeRes.json() : { theme: { version: 1 } },
          auditRes.ok ? auditRes.json() : { logs: [] },
        ]);

        setData({
          teamCount: team.team?.length || 0,
          committeeCount: comm.committee?.length || 0,
          projectsCount: proj.projects?.length || 0,
          unreadMessagesCount: (msg.messages || []).filter((m: { status: string }) => m.status === "unread").length,
          themeVersion: theme.theme?.version || 1,
          recentAudit: (audit.logs || []).slice(0, 5),
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span className="text-xs font-mono uppercase tracking-wider">Loading Overview...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span>Website Administration</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage public website content, media assets, team profiles, and brand styling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </Link>
          <Link
            href="/admin/appearance"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Customize Branding</span>
          </Link>
        </div>
      </div>

      {/* 4 Clean Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Committee & Leadership Directory */}
        <Link
          href="/admin/content/committee"
          className="p-4 rounded-xl bg-[#090f1d] border border-slate-800 hover:border-cyan-500/50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase font-mono">Committee</span>
            <Users className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{data?.committeeCount}</span>
            <span className="text-xs text-slate-400 ml-1.5">Members &amp; Leaders</span>
          </div>
        </Link>

        {/* Projects */}
        <Link
          href="/admin/content/projects"
          className="p-4 rounded-xl bg-[#090f1d] border border-slate-800 hover:border-purple-500/50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase font-mono">Projects</span>
            <Briefcase className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{data?.projectsCount}</span>
            <span className="text-xs text-slate-400 ml-1.5">Items</span>
          </div>
        </Link>

        {/* Contact Messages */}
        <Link
          href="/admin/contact"
          className="p-4 rounded-xl bg-[#090f1d] border border-slate-800 hover:border-emerald-500/50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase font-mono">Inquiries</span>
            <Mail className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{data?.unreadMessagesCount}</span>
            <span className="text-xs text-emerald-400 ml-1.5 font-medium">Unread</span>
          </div>
        </Link>

        {/* Homepage Sections */}
        <Link
          href="/admin/content/home"
          className="p-4 rounded-xl bg-[#090f1d] border border-slate-800 hover:border-amber-500/50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase font-mono">Homepage CMS</span>
            <Home className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">6</span>
            <span className="text-xs text-slate-400 ml-1.5">Live Sections</span>
          </div>
        </Link>
      </div>

      {/* Main Grid: Management Shortcuts + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick Navigation Modules */}
        <div className="lg:col-span-7 bg-[#090f1d] border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Website Content Modules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                title: "Homepage Management",
                desc: "Hero title, subtitle, CTA links, section visibility.",
                href: "/admin/content/home",
                icon: Home,
                color: "text-cyan-400",
              },
              {
                title: "About Us Content",
                desc: "Organization intro, mission, vision, and core values.",
                href: "/admin/content/about",
                icon: FileText,
                color: "text-blue-400",
              },
              {
                title: "Committee & Leadership",
                desc: "Executive board, technical, and operations officials directory.",
                href: "/admin/content/committee",
                icon: Users,
                color: "text-cyan-400",
              },
              {
                title: "Appearance & Branding",
                desc: "Live design tokens, colors, fonts, logo, and gradient studio.",
                href: "/admin/appearance",
                icon: Palette,
                color: "text-purple-400",
              },
              {
                title: "Projects Manager",
                desc: "Student projects, status, tags, and GitHub URLs.",
                href: "/admin/content/projects",
                icon: Briefcase,
                color: "text-emerald-400",
              },
              {
                title: "Contact & Inquiries",
                desc: "Public email, location address, and inbox messages.",
                href: "/admin/contact",
                icon: Mail,
                color: "text-amber-400",
              },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  className="p-3.5 rounded-lg bg-[#060c18] border border-slate-800 hover:border-cyan-500/40 transition-colors group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className={`w-4 h-4 ${m.color}`} />
                      <span className="font-semibold text-white text-xs">{m.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{m.desc}</p>
                  </div>
                  <div className="mt-3 flex items-center text-[10px] font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <span>Manage Module →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recent Activity Logs */}
        <div className="lg:col-span-5 bg-[#090f1d] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>Recent Activity</span>
            </h2>
            <Link href="/admin/audit" className="text-[11px] text-cyan-400 hover:underline font-mono">
              View All Logs →
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentAudit && data.recentAudit.length > 0 ? (
              data.recentAudit.map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg bg-[#060c18] border border-slate-800/80 flex items-start justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-200 block truncate">{log.action}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{log.userName}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">No recent actions recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
