"use client";

import { motion } from "framer-motion";
import { TeamMember } from "@/data/team";

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-slate-800/70 hover:border-cyan-500/50 shadow-xl hover:shadow-2xl hover:shadow-cyan-950/40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 cursor-pointer bg-[#080e1c] group"
    >
      {/* Full Card Background Photo */}
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
      />

      {/* Dark Vignette Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-[#050a14]/30 to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-95" />

      {/* Cyan Accent Bar on Left Border on Hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Bottom Text Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col items-start justify-end z-10">
        {/* Role Pill Badge */}
        <span className="px-2.5 py-1 rounded-md bg-cyan-950/90 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[10px] font-extrabold uppercase tracking-widest mb-1.5 shadow-md">
          {member.role}
        </span>

        {/* Member Name */}
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-cyan-200 transition-colors">
          {member.name}
        </h3>
      </div>
    </motion.div>
  );
}
