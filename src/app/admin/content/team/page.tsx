"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";

export default function TeamManagementRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to the unified Committee Management page
    const timer = setTimeout(() => {
      router.replace("/admin/content/committee");
    }, 1200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="py-24 max-w-xl mx-auto text-center space-y-6 font-sans">
      <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto shadow-xl">
        <Users className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h1 className="text-xl font-bold text-white">
          Team Management is now Unified with Committee
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
          All executive officials and committee members are now managed centrally in one unified directory. Redirecting you to Committee Management...
        </p>
      </div>

      <div>
        <Link
          href="/admin/content/committee"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-cyan-500/20"
        >
          <span>Go to Committee Management</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
