"use client";

import Link from "next/link";
import { ArrowLeft, History, Shield, Trophy, Users, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function ClubHistoryPage() {
  const milestones = [
    {
      year: "2024",
      title: "Foundation of ICASA Student Chapter",
      description: "Established at Sri Lanka Technology Campus under the School of Computing to foster practical cybersecurity awareness, hands-on learning, and ethical research.",
      icon: Shield,
    },
    {
      year: "2025",
      title: "First Annual University CTF & Technical Workshops",
      description: "Launched hands-on Linux security workshops and organized the university's premier Capture The Flag competition for over 150 student participants.",
      icon: Trophy,
    },
    {
      year: "2026",
      title: "Executive Board 2026/2027 & Industry Publications",
      description: "Appointed 7 Executive Board officers, expanded student research publications in AI security, and partnered with industry cybersecurity mentors.",
      icon: Award,
    },
  ];

  return (
    <div className="pt-32 pb-24 font-sans bg-[#070d19] text-white min-h-screen">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/about-us"
          className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO ABOUT US</span>
        </Link>

        {/* Page Title Header */}
        <div className="mb-16 pb-8 border-b border-slate-800/80">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>OUR JOURNEY & MILESTONES</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            ICASA Club <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">History</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg mt-3 max-w-2xl font-normal">
            Tracing our growth from a student security interest group to an official university chapter leading cybersecurity education.
          </p>
        </div>

        {/* Timeline Component */}
        <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-8 space-y-12 my-12">
          {milestones.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative pl-8 sm:pl-12 group"
              >
                {/* Timeline Node Marker */}
                <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-[#0a1120] border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-md group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content Box */}
                <div className="p-6 sm:p-8 bg-[#0a1120] border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl shadow-xl transition-all duration-300">
                  <span className="inline-block px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono uppercase tracking-widest mb-3">
                    YEAR {item.year}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
