"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import NewsCard from "@/components/NewsCard";
import { newsData } from "@/data/newsData";

export default function CyberNewsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Cybersecurity", "Technology", "AI Security", "Digital Privacy", "Research"];

  const featuredArticle = newsData.find((item) => item.featured) || newsData[0];
  const remainingNews = newsData.filter((item) => !item.featured);

  const filteredNews = remainingNews.filter((item) =>
    activeCategory === "All" ? true : item.category === activeCategory
  );

  return (
    <div className="pt-32 pb-24 font-sans bg-[#070d19] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title Header */}
        <div className="mb-12 pb-8 border-b border-white/10">
          <div className="inline-block px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3 font-mono border border-cyan-500/20">
            Publications & News
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Cyber News
          </h1>
          <p className="text-slate-300 text-base mt-2 max-w-2xl">
            Articles, research insights, and technological developments published by ICASA members.
          </p>
        </div>

        {/* Large Featured Article Top Banner */}
        {featuredArticle && (
          <div className="mb-16 rounded-2xl glass-card border border-cyan-500/30 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8">
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2.5 py-0.5 rounded bg-cyan-400 text-[#070d19] text-[11px] font-bold font-mono">
                    {featuredArticle.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    {featuredArticle.publishedDate}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-3 hover:text-cyan-400 transition-colors">
                  {featuredArticle.title}
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
                  {featuredArticle.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono">
                <span className="text-xs text-slate-400">
                  ICASA Research Publication Unit
                </span>
                <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-cyan-400 hover:bg-cyan-300 text-[#070d19] text-xs font-bold transition-colors uppercase">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-64 lg:h-auto rounded-xl overflow-hidden bg-slate-950 border border-white/10">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 font-mono">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeCategory === cat
                  ? "bg-cyan-400 text-[#070d19] font-bold shadow-md"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>

      </div>
    </div>
  );
}
