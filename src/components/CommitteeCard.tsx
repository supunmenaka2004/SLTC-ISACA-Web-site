"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { CommitteeMember } from "@/data/committeeData";

const LinkedInIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function CommitteeCard({ member }: { member: CommitteeMember }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pro-dark-card p-6 flex flex-col justify-between"
    >
      <div>
        {/* Portrait Avatar Placeholder */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 font-mono font-black text-xl shadow-lg">
          {member.initials}
        </div>

        {/* Name & Position */}
        <div className="text-center mb-3">
          <h3 className="text-base font-bold text-white leading-snug">
            {member.name}
          </h3>
          <span className="inline-block px-2.5 py-0.5 mt-1 rounded.md bg-cyan-500/10 text-cyan-400 text-xs font-bold font-mono border border-cyan-500/20">
            {member.position}
          </span>
        </div>

        {/* Short Bio */}
        <p className="text-xs text-slate-300 text-center leading-relaxed line-clamp-3">
          {member.bio}
        </p>
      </div>

      {/* Social Links */}
      <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-center gap-3 text-slate-400">
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded hover:bg-slate-900 hover:text-cyan-400 transition-colors"
          aria-label="LinkedIn"
        >
          <LinkedInIcon />
        </a>
        <a
          href={`mailto:${member.email}`}
          className="p-1.5 rounded hover:bg-slate-900 hover:text-cyan-400 transition-colors"
          aria-label="Email"
        >
          <Mail className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}
