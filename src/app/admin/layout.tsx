"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  FileText,
  UserCheck,
  Users,
  Briefcase,
  Mail,
  Settings,
  Image as ImageIcon,
  Shield,
  History,
  LogOut,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import IsacaFullLogo from "@/components/IsacaFullLogo";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "CONTENT_ADMIN" | "VIEWER" | "CHIEF_EDITOR" | "NEWS_EDITOR" | "NEWS_CONTRIBUTOR";
  avatar?: string;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface NavItem {
  name: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  badge?: string;
  count?: number;
  visible: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast dispatcher helper
  const addToast = (type: "success" | "error" | "info", message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Check auth session
  useEffect(() => {
    // If on login page, skip auth check
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setSession(data.user);
          } else {
            setSession(null);
            router.replace("/admin/login");
          }
        } else {
          setSession(null);
          router.replace("/admin/login");
        }
      } catch {
        setSession(null);
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname, router]);

  // Fetch unread count for badge
  useEffect(() => {
    if (!session) return;
    async function fetchCounts() {
      try {
        const res = await fetch("/api/contact?status=unread");
        if (res.ok) {
          const data = await res.json();
          setUnreadMessages(data.unreadCount || 0);
        }
      } catch {
        // Ignore background polling errors
      }
    }
    fetchCounts();
  }, [session, pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  // If on login page, render clean login view
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-slate-400 font-mono">Authenticating Session...</p>
        </div>
      </div>
    );
  }

  // Block unauthenticated access completely
  if (!session) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-slate-400 font-mono">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const role = session.role;
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isContentAdmin = role === "CONTENT_ADMIN" || isSuperAdmin;
  const isViewer = role === "VIEWER";

  // Exact 11 simple navigation items
  const navSections: NavSection[] = [
    {
      title: "Content Modules",
      items: [
        {
          name: "Dashboard",
          href: "/admin",
          icon: LayoutDashboard,
          visible: true,
        },
        {
          name: "Home",
          href: "/admin/content/home",
          icon: Home,
          visible: isContentAdmin,
        },
        {
          name: "About Us",
          href: "/admin/content/about",
          icon: FileText,
          visible: isContentAdmin,
        },
        {
          name: "Committee",
          href: "/admin/content/committee",
          icon: Users,
          visible: isContentAdmin,
        },
        {
          name: "Projects",
          href: "/admin/content/projects",
          icon: Briefcase,
          visible: isContentAdmin,
        },
        {
          name: "Contact",
          href: "/admin/contact",
          icon: Mail,
          count: unreadMessages > 0 ? unreadMessages : undefined,
          visible: isContentAdmin,
        },
      ],
    },
    {
      title: "Administration",
      items: [
        {
          name: "Website Settings",
          href: "/admin/settings",
          icon: Settings,
          visible: isSuperAdmin,
        },
        {
          name: "Media Library",
          href: "/admin/media",
          icon: ImageIcon,
          visible: true,
        },
        {
          name: "Users & Permissions",
          href: "/admin/users",
          icon: Shield,
          visible: isSuperAdmin,
        },
        {
          name: "Activity Logs",
          href: "/admin/audit",
          icon: History,
          visible: isSuperAdmin,
        },
      ],
    },
  ];

  const getRoleBadgeStyle = (userRole: string) => {
    switch (userRole) {
      case "SUPER_ADMIN":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
      case "CONTENT_ADMIN":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "VIEWER":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/40";
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex font-sans antialiased">
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-lg shadow-2xl border text-xs font-medium flex items-center gap-2.5 backdrop-blur-md animate-in slide-in-from-bottom-2 ${
              toast.type === "success"
                ? "bg-[#06201a]/90 text-emerald-300 border-emerald-500/40"
                : toast.type === "error"
                ? "bg-[#250d11]/90 text-rose-300 border-rose-500/40"
                : "bg-[#0c192d]/90 text-cyan-300 border-cyan-500/40"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === "error" && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === "info" && <Info className="w-4 h-4 text-cyan-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Professional Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#090f1d] border-r border-slate-800/80 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <IsacaFullLogo height={38} />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Badge */}
        <div className="px-4 py-2 bg-[#0d1527] border-b border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
          <span className="text-cyan-400 font-semibold tracking-wider uppercase">ADMIN PORTAL</span>
          <span className="text-[10px] text-slate-400">v2.4.0</span>
        </div>

        {/* Navigation Modules */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((sec) => {
            const visibleItems = sec.items.filter((i) => i.visible);
            if (visibleItems.length === 0) return null;

            return (
              <div key={sec.title} className="space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                  {sec.title}
                </p>
                {visibleItems.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                        isActive
                          ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm"
                          : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"
                          }`}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>

                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono uppercase">
                          {item.badge}
                        </span>
                      )}

                      {typeof item.count === "number" && item.count > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500 text-slate-950 font-bold font-mono">
                          {item.count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* User Card at bottom */}
        <div className="p-3 border-t border-slate-800/80 bg-[#060b14]">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-xs uppercase shrink-0">
              {session?.name ? session.name.substring(0, 2).toUpperCase() : "AD"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{session?.name || "Administrator"}</p>
              <span
                className={`inline-block text-[9px] px-1.5 py-0.2 rounded border font-mono uppercase tracking-wider ${getRoleBadgeStyle(
                  role
                )}`}
              >
                {role.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Administrative Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Administrative Bar */}
        <header className="h-14 bg-[#090f1d] border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white bg-slate-800/60"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumb Info */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="text-cyan-400">SLTC ISACA</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-200 capitalize">
                {pathname.replace("/admin", "").replace("/", "") || "Dashboard"}
              </span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3 font-sans">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800/80 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              <span>Live Website</span>
              <ExternalLink className="w-3 h-3 text-cyan-400" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-950/40 border border-rose-800/50 hover:bg-rose-900/40 text-rose-300 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#030712]">
          {children}
        </main>
      </div>
    </div>
  );
}
