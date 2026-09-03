"use client";

import { motion } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";
import { ResourceItem } from "@/data/resourcesData";

export default function ResourceCard({ resource }: { resource: ResourceItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pro-dark-card p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="w-9 h-9 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="px-2.5 py-0.5 rounded bg-slate-900 text-slate-300 text-[11px] font-bold border border-slate-800 font-mono">
            {resource.category}
          </span>
        </div>

        <h3 className="text-base font-bold text-white leading-snug mb-2">
          {resource.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
          {resource.description}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-800/80">
        <a
          href={resource.url}
          target={resource.url.startsWith("http") ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
        >
          <span>{resource.linkText}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}
