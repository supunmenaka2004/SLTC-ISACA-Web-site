"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { newsData, NewsItem } from "@/data/newsData";
import NewsStoryCard from "@/components/NewsStoryCard";
import WordColoredHeading from "./WordColoredHeading";
import DynamicIcon from "./DynamicIcon";
import { WordColor } from "@/server/db/schema";

export default function CyberNewsEditorialSection() {
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>(newsData.slice(0, 3));
  const [newsConfig, setNewsConfig] = useState<{
    kicker: string;
    icon: string;
    title: string;
    words?: WordColor[];
    ctaText: string;
    desc: string;
  }>({
    kicker: "INSIGHTS & PUBLICATIONS",
    icon: "Newspaper",
    title: "Latest Cyber News",
    words: [
      { text: "Latest", color: "#ffffff" },
      { text: "Cyber", color: "#22d3ee" },
      { text: "News", color: "#22d3ee" },
    ],
    ctaText: "VIEW ALL NEWS",
    desc: "Stay informed about the latest developments in cybersecurity, technology and digital security.",
  });

  useEffect(() => {
    async function loadLive() {
      try {
        const res = await fetch("/api/public/site-data", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.news && data.news.length > 0) {
            setFeaturedNews(data.news.slice(0, 3));
          }
          if (data.homepage) {
            setNewsConfig({
              kicker: data.homepage.newsPreviewKicker || "INSIGHTS & PUBLICATIONS",
              icon: data.homepage.newsPreviewIcon || "Newspaper",
              title: data.homepage.newsPreviewTitle || "Latest Cyber News",
              words: data.homepage.newsPreviewTitleWords,
              ctaText: data.homepage.newsPreviewCtaText || "VIEW ALL NEWS",
              desc: data.homepage.newsPreviewDesc || "Stay informed about the latest developments in cybersecurity, technology and digital security.",
            });
          }
        }
      } catch {}
    }
    loadLive();
  }, []);

  return (
    <section className="py-24 bg-[#070d19] font-sans relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-3 text-cyan-300/90 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] mb-5">
              <DynamicIcon name={newsConfig.icon || "Newspaper"} className="w-3.5 h-3.5 text-cyan-400" />
              <span className="h-px w-7 bg-cyan-500/70" />
              <span>{newsConfig.kicker}</span>
            </div>

            {/* Prominent Large Heading with Word Colors */}
            <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-semibold tracking-[-0.045em] leading-tight">
              <WordColoredHeading
                words={newsConfig.words}
                rawText={newsConfig.title}
                defaultColor="#ffffff"
                highlightColor="#22d3ee"
              />
            </h2>

            <div className="h-px w-16 bg-cyan-400/80 my-5" />

            <p className="text-slate-300 text-base sm:text-lg font-normal">
              {newsConfig.desc}
            </p>
          </div>

          {/* Text CTA Link */}
          <Link
            href="/cyber-news"
            className="inline-flex items-center gap-3 border-b border-cyan-500/50 pb-2 text-cyan-200 hover:border-cyan-300 hover:text-white font-semibold text-xs sm:text-sm uppercase tracking-[0.12em] transition-colors duration-300 group shrink-0"
          >
            <span>{newsConfig.ctaText || "VIEW ALL NEWS"}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 text-cyan-400" />
          </Link>
        </div>

        {/* CLEAN 3-COLUMN NEWS BOX CARDS ROW GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredNews.map((news) => (
            <NewsStoryCard key={news.id} news={news} />
          ))}
        </div>

      </div>
    </section>
  );
}
