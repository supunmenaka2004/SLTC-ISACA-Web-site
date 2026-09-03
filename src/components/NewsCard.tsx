"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { NewsItem } from "@/data/newsData";

export default function NewsCard({ news }: { news: NewsItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-[#0a1120] border border-slate-800/80 hover:border-cyan-500/40 rounded-xl overflow-hidden transition-all duration-300 shadow-lg group flex flex-col h-full"
      >
        {/* Article Cover Image (55-60% of card height) */}
        <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-slate-900 shrink-0">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        {/* Card Body - Clean Editorial Layout */}
        <div className="p-5 flex flex-col flex-grow justify-between">
          <div>
            {/* Category - Small Uppercase Text */}
            <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest block mb-2 font-sans">
              {news.category}
            </span>

            {/* Article Title - Main Visual Focus */}
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug tracking-tight group-hover:text-cyan-300 transition-colors line-clamp-2 mb-3">
              {news.title}
            </h3>
          </div>

          <div>
            {/* Published Date - Small Muted Gray Text */}
            <p className="text-xs text-slate-400 font-medium mb-4">
              {news.publishedDate}
            </p>

            {/* Read Article -> Simple Text Link Button (Modal opens ONLY when clicked) */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider cursor-pointer group/read"
            >
              <span>READ ARTICLE</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/read:translate-x-1" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Article Full View Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-sans">
          <div className="bg-[#0d1527] rounded-xl border border-slate-700/80 shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1 block">
                  {news.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  {news.title}
                </h2>
                <div className="text-xs text-slate-400 mt-2 font-medium">
                  Published on {news.publishedDate} • ICASA Publication Unit
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border-l-4 border-cyan-400 text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                {news.excerpt}
              </div>

              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4 font-normal">
                <p>{news.content}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-full transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Close Article
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
