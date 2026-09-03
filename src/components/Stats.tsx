"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, Calendar, FolderGit2, Wrench } from "lucide-react";

export default function Stats() {
  const statsList = [
    { label: "Active Members", value: "250+", icon: Users, color: "text-cyan-400" },
    { label: "Events & CTFs", value: "25+", icon: Calendar, color: "text-emerald-400" },
    { label: "Cyber Projects", value: "15+", icon: FolderGit2, color: "text-sky-400" },
    { label: "Hands-on Workshops", value: "10+", icon: Wrench, color: "text-purple-400" },
  ];

  return (
    <section className="relative z-20 py-8 border-y border-cyan-500/20 bg-[#070d19]/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Status Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5 text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <ShieldCheck className="w-4 h-4" />
            <span className="font-bold tracking-widest uppercase">SYSTEM STATUS: OPERATIONAL</span>
          </div>

          <div className="text-slate-400 flex items-center gap-4">
            <span>NETWORK LATENCY: 12ms</span>
            <span className="hidden sm:inline">FIREWALL: ACTIVE</span>
          </div>
        </div>

        {/* Counter Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statsList.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card rounded-xl p-5 flex items-center gap-4 border border-white/5"
              >
                <div className={`w-12 h-12 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center ${stat.color} shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-400 font-sans font-medium mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
