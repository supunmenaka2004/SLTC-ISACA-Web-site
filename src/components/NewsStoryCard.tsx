"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Building2 } from "lucide-react";
import type { NewsItem } from "@/data/newsData";

export default function NewsStoryCard({
  news,
  variant = "site",
}: {
  news: NewsItem;
  variant?: "site" | "newsroom";
}) {
  const newsroom = variant === "newsroom";

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="group flex flex-col h-full"
    >
      <Link
        href={`/cyber-news/${news.id}`}
        className={`flex h-full flex-col overflow-hidden rounded-xl border transition-all duration-300 focus-visible:outline focus-visible:outline-2 ${
          newsroom
            ? "border-white/10 bg-[#0d1527] hover:border-cyan-400/40 hover:shadow-[0_8px_30px_rgba(0,240,255,0.08)] focus-visible:outline-cyan-400"
            : "border-slate-800/80 bg-[#0a1120] hover:border-cyan-400/40 hover:shadow-[0_8px_30px_rgba(0,240,255,0.08)] focus-visible:outline-cyan-400"
        }`}
      >
        {/* 1. Relevant Featured Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 shrink-0">
          <Image
            src={news.image}
            alt={news.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60" />
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between">
          <div>
            {/* 2. Small Category Label & 5. Publication Date */}
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 rounded-sm">
                {news.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-normal">
                <Calendar className="h-3 w-3 text-cyan-400/70" aria-hidden="true" />
                {news.publishedDate}
              </span>
            </div>

            {/* 3. Main Headline (visually prominent and bold/semibold) */}
            <h3 className="text-base sm:text-lg font-semibold leading-snug tracking-[-0.02em] text-white transition-colors duration-200 group-hover:text-cyan-300 line-clamp-2">
              {news.title}
            </h3>

            {/* 4. Short Summary (strictly 1-2 lines, regular weight) */}
            <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-300/90 font-normal line-clamp-2">
              {news.excerpt}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
            {/* 6. Original Publisher / Source */}
            <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-normal min-w-0 truncate">
              <Building2 className="h-3 w-3 text-slate-500 shrink-0" aria-hidden="true" />
              <span className="truncate">{news.publisher}</span>
            </span>

            {/* 7. Read Full Story Link */}
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-300 group-hover:text-cyan-200 shrink-0">
              <span>Read Full Story</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
