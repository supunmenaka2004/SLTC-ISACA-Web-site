"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock3, UserCheck, Building2 } from "lucide-react";
import { getReadingTimeMinutes, type NewsItem } from "@/data/newsData";

export default function NewsStoryCard({
  news,
  variant = "site",
}: {
  news: NewsItem;
  variant?: "site" | "newsroom";
}) {
  const newsroom = variant === "newsroom";
  const readTime = getReadingTimeMinutes(news);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group flex flex-col h-full"
    >
      <Link
        href={`/cyber-news/${news.id}`}
        className={`flex h-full flex-col overflow-hidden rounded-xl border transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 ${
          newsroom
            ? "border-white/[0.08] bg-[#0c1426] hover:border-cyan-400/50 hover:shadow-[0_12px_36px_-10px_rgba(0,240,255,0.14)]"
            : "border-slate-800/80 bg-[#0a1120] hover:border-cyan-400/50 hover:shadow-[0_12px_36px_-10px_rgba(0,240,255,0.14)]"
        }`}
      >
        {/* 1. Featured Image with Editorial Aspect Ratio */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 shrink-0">
          <Image
            src={news.image}
            alt={news.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1426] via-transparent to-transparent opacity-75" />
          
          {/* Subtle Top Kicker on Image */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-cyan-300 bg-[#030712]/85 border border-cyan-500/40 rounded-xs backdrop-blur-md shadow-sm">
              {news.category}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-slate-300 bg-[#030712]/85 border border-white/10 rounded-xs backdrop-blur-md">
              <Clock3 className="h-3 w-3 text-cyan-400" />
              <span>{readTime}m read</span>
            </span>
          </div>
        </div>

        {/* 2. Card Body: Human Journalistic Hierarchy */}
        <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between">
          <div>
            {/* Publication Date */}
            <div className="mb-2.5 flex items-center gap-2 text-[11px] text-slate-400">
              <Calendar className="h-3.5 w-3.5 text-cyan-400/70 shrink-0" aria-hidden="true" />
              <span>{news.publishedDate}</span>
            </div>

            {/* Main Headline */}
            <h3 className="text-base sm:text-[17px] font-bold leading-snug tracking-[-0.02em] text-white transition-colors duration-200 group-hover:text-cyan-300 line-clamp-2">
              {news.title}
            </h3>

            {/* Short Editorial Summary (Strictly 1-2 lines) */}
            <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-slate-300/85 font-normal line-clamp-2">
              {news.excerpt}
            </p>
          </div>

          {/* 3. Footer: Human Author & Read Full Story Link */}
          <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
            {/* Author / Desk Attribution */}
            <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 min-w-0 truncate">
              {news.author ? (
                <>
                  <UserCheck className="h-3.5 w-3.5 text-cyan-400/70 shrink-0" aria-hidden="true" />
                  <span className="truncate">{news.author}</span>
                </>
              ) : (
                <>
                  <Building2 className="h-3.5 w-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                  <span className="truncate">{news.publisher}</span>
                </>
              )}
            </div>

            {/* Read Full Story Button */}
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-300 group-hover:text-cyan-200 shrink-0">
              <span>Read Story</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
