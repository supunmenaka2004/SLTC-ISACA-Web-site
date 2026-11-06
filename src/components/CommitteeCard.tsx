"use client";

import { useState } from "react";
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

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function CommitteeCard({ member }: { member: CommitteeMember }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative rounded-2xl overflow-hidden bg-[#080e1c] border border-slate-800/80 hover:border-cyan-500/50 shadow-xl hover:shadow-cyan-950/30 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
    >
      <div>
        {/* Large Prominent Professional Portrait Photo */}
        <div className="relative w-full aspect-[4/4.5] sm:aspect-[4/4.6] bg-slate-900 overflow-hidden">
          {member.image && !imgError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-[#0a1426] to-[#040812] text-cyan-400 font-mono font-black text-4xl">
              <span>{member.initials || member.name.split(" ").map(w => w[0]).join("").slice(0, 2)}</span>
            </div>
          )}

          {/* Soft Bottom Shadow Gradient for seamless transition */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080e1c] via-[#080e1c]/10 to-transparent pointer-events-none" />

          {/* Category Chip floating on top-right */}
          {member.category && (
            <div className="absolute top-3 right-3 z-10">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/85 text-cyan-300 border border-cyan-500/30 backdrop-blur-md shadow-md">
                {member.category}
              </span>
            </div>
          )}
        </div>

        {/* Member Details */}
        <div className="p-5 pt-3">
          {/* Position Badge */}
          <div className="mb-2">
            <span className="inline-block px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-xs font-bold font-mono border border-cyan-500/25">
              {member.position}
            </span>
          </div>

          {/* Member Name */}
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug">
            {member.name}
          </h3>

          {/* Bio */}
          {member.bio && (
            <p className="mt-2.5 text-xs text-slate-300/90 leading-relaxed line-clamp-3 font-normal">
              {member.bio}
            </p>
          )}
        </div>
      </div>

      {/* Social Links Footer */}
      <div className="px-5 pb-5 pt-2 mt-auto">
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-slate-400">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Connect
          </span>
          <div className="flex items-center gap-2">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded hover:bg-slate-800 hover:text-cyan-400 text-slate-300 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
            )}
            {member.github && (
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded hover:bg-slate-800 hover:text-cyan-400 text-slate-300 transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="p-1.5 rounded hover:bg-slate-800 hover:text-cyan-400 text-slate-300 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
