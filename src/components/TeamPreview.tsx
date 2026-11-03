"use client";

import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { motion } from "framer-motion";
import { executiveMembers } from "@/data/team";
import TeamMemberCard from "./TeamMemberCard";

export default function TeamPreview() {
  const topRowMembers = executiveMembers.slice(0, 4);
  const bottomRowMembers = executiveMembers.slice(4, 7);

  return (
    <section className="bg-[#070d19] py-20 font-sans border-b border-slate-800/40 relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Centered Section Header with Category Tag Badge & Gradient Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          
          {/* Section label */}
          <div className="inline-flex items-center gap-3 text-cyan-300/90 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] mb-5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="h-px w-7 bg-cyan-500/70" />
            <span>EXECUTIVE BOARD 2026/2027</span>
          </div>

          {/* Prominent Large Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-semibold text-white tracking-[-0.045em] leading-tight">
            Meet <span className="text-cyan-300">Our Team</span>
          </h2>

          <div className="h-px w-16 bg-cyan-400/80 my-5" />

          {/* Subtitle */}
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            The people behind ICASA, working together to learn, innovate and build a safer digital future.
          </p>
        </div>

        {/* Executive Team Members Grid Layout */}
        <div className="flex flex-col gap-6 sm:gap-8">
          
          {/* Top Row: 4 Members */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {topRowMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </motion.div>

          {/* Bottom Row: 3 Members Perfectly Centered Underneath Top 4 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3,
                },
              },
            }}
            className="flex flex-wrap justify-center gap-6 sm:gap-8"
          >
            {bottomRowMembers.map((member) => (
              <div
                key={member.id}
                className="w-full sm:w-[calc(50%-0.875rem)] lg:w-[calc(25%-1.5rem)] flex flex-col"
              >
                <TeamMemberCard member={member} />
              </div>
            ))}
          </motion.div>

        </div>

        {/* View Full Committee CTA */}
        <div className="mt-16 text-center flex justify-center">
          <Link
            href="/committee"
            className="inline-flex items-center gap-3 border-b border-cyan-500/50 pb-2 text-cyan-200 hover:border-cyan-300 hover:text-white font-semibold text-xs sm:text-sm uppercase tracking-[0.12em] transition-colors duration-300 group"
          >
            <span>VIEW FULL COMMITTEE</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 text-cyan-400" />
          </Link>
        </div>

      </div>
    </section>
  );
}
