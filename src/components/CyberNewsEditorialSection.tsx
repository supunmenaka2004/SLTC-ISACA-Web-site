"use client";

import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { newsData } from "@/data/newsData";
import NewsCard from "@/components/NewsCard";

export default function CyberNewsEditorialSection() {
  const featuredNews = newsData.slice(0, 3);

  return (
    <section className="py-24 bg-[#070d19] font-sans relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Styled Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            {/* Category Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3 shadow-sm backdrop-blur-sm">
              <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
              <span>INSIGHTS & PUBLICATIONS</span>
            </div>

            {/* Prominent Large Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-[48px] font-extrabold text-white tracking-tight leading-tight">
              Latest <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Cyber News</span>
            </h2>

            {/* Cyan Gradient Underline Accent Bar */}
            <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full my-4" />

            <p className="text-slate-300 text-base sm:text-lg font-normal">
              Stay informed about the latest developments in cybersecurity, technology and digital security.
            </p>
          </div>

          {/* Outlined Pill CTA Link Button */}
          <Link
            href="/cyber-news"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-md group shrink-0"
          >
            <span>VIEW ALL NEWS</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 text-cyan-400" />
          </Link>
        </div>

        {/* CLEAN 3-COLUMN NEWS BOX CARDS ROW GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>

      </div>
    </section>
  );
}
