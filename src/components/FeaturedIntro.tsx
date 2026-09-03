"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturedIntro() {
  return (
    <section className="py-16 bg-[#030712] border-b border-slate-800/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4">
            Who We Are
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
            ICASA Club is an official university student organization dedicated to empowering students with practical cybersecurity knowledge, technical skills, ethical hacking awareness, and research opportunities. We bridge academic foundations with industrial technology standards.
          </p>

          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors font-mono tracking-wide uppercase"
          >
            <span>Read More About Our Mission</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

        </div>
      </div>
    </section>
  );
}
