"use client";

import Image from "next/image";
import Link from "next/link";
import { Flame } from "lucide-react";
import { newsData } from "@/data/newsData";

export default function TrendingNewsTicker() {
  // Use all real published cybersecurity stories, duplicated to ensure smooth wide-screen coverage
  const baseItems = newsData;
  const tickerItems = [...baseItems, ...baseItems];

  return (
    <section
      aria-label="Trending Cybersecurity News Ticker"
      className="mb-10 sm:mb-12 overflow-hidden"
    >
      {/* Ticker Header / Section Kicker */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300">
            Trending Intelligence
          </span>
          <span className="hidden sm:inline-block h-px w-8 bg-cyan-500/40" />
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          <Flame className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
          <span>Live Radar</span>
        </div>
      </div>

      {/* Ticker Viewport Container with Left/Right Ambient Fade Masks */}
      <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#060b17]/80 py-3.5 backdrop-blur-sm ticker-pause-hover shadow-xl">
        
        {/* Left Ambient Fade Mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-12 sm:w-24 bg-gradient-to-r from-[#030712] via-[#030712]/80 to-transparent"
        />

        {/* Right Ambient Fade Mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-12 sm:w-24 bg-gradient-to-l from-[#030712] via-[#030712]/80 to-transparent"
        />

        {/* Continuous Left-to-Right Scrolling Marquee Track */}
        <div className="animate-ticker-ltr flex">
          {/* Track 1 */}
          <div className="flex shrink-0 items-center gap-4 pr-4">
            {tickerItems.map((news, index) => (
              <Link
                key={`track1-${news.id}-${index}`}
                href={`/cyber-news/${news.id}`}
                className="group relative flex-shrink-0 w-[290px] sm:w-[330px] h-[145px] sm:h-[155px] overflow-hidden rounded-lg border border-white/10 bg-[#0d1527] transition-all duration-300 hover:border-cyan-400/60 hover:shadow-[0_4px_24px_rgba(0,240,255,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2"
              >
                {/* 1. Relevant Cybersecurity Background Image */}
                <Image
                  src={news.image}
                  alt={news.imageAlt}
                  fill
                  sizes="(max-width: 640px) 290px, 330px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* 2. Dark Gradient Overlay (Transparent at top to dark at bottom) */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#020611]/98 via-[#020611]/70 to-[#020611]/15 transition-opacity duration-300 group-hover:via-[#020611]/60"
                />

                {/* 3. Text Overlay: Lower-Left Area directly on top of the image */}
                <div className="absolute inset-0 flex flex-col justify-end p-3.5 sm:p-4 text-left">
                  {/* Small Category Label & Publication Date */}
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 rounded-xs backdrop-blur-sm">
                      {news.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {news.publishedDate}
                    </span>
                  </div>

                  {/* Bold, Readable News Headline */}
                  <h3 className="text-xs sm:text-[13px] font-bold leading-snug tracking-tight text-white line-clamp-2 transition-colors duration-200 group-hover:text-cyan-200">
                    {news.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Track 2 (Identical duplicate for seamless continuous loop) */}
          <div
            className="flex shrink-0 items-center gap-4 pr-4"
            aria-hidden="true"
          >
            {tickerItems.map((news, index) => (
              <Link
                key={`track2-${news.id}-${index}`}
                href={`/cyber-news/${news.id}`}
                tabIndex={-1}
                className="group relative flex-shrink-0 w-[290px] sm:w-[330px] h-[145px] sm:h-[155px] overflow-hidden rounded-lg border border-white/10 bg-[#0d1527] transition-all duration-300 hover:border-cyan-400/60 hover:shadow-[0_4px_24px_rgba(0,240,255,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2"
              >
                {/* 1. Relevant Cybersecurity Background Image */}
                <Image
                  src={news.image}
                  alt={news.imageAlt}
                  fill
                  sizes="(max-width: 640px) 290px, 330px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* 2. Dark Gradient Overlay */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#020611]/98 via-[#020611]/70 to-[#020611]/15 transition-opacity duration-300 group-hover:via-[#020611]/60"
                />

                {/* 3. Text Overlay: Lower-Left Area directly on top of the image */}
                <div className="absolute inset-0 flex flex-col justify-end p-3.5 sm:p-4 text-left">
                  {/* Small Category Label & Publication Date */}
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 rounded-xs backdrop-blur-sm">
                      {news.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {news.publishedDate}
                    </span>
                  </div>

                  {/* Bold, Readable News Headline */}
                  <h3 className="text-xs sm:text-[13px] font-bold leading-snug tracking-tight text-white line-clamp-2 transition-colors duration-200 group-hover:text-cyan-200">
                    {news.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
