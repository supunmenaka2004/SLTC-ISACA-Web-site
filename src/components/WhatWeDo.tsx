"use client";

import { motion } from "framer-motion";
import { Shield, Cpu, Lightbulb, Users } from "lucide-react";

export default function WhatWeDo() {
  const pillarList = [
    {
      title: "Cybersecurity",
      description: "Promoting cybersecurity knowledge, risk management, and digital safety awareness.",
      icon: Shield,
      color: "text-cyan-400",
    },
    {
      title: "Technology",
      description: "Exploring modern technologies, cloud platforms, and practical IT audit solutions.",
      icon: Cpu,
      color: "text-emerald-400",
    },
    {
      title: "Innovation",
      description: "Encouraging students to build, experiment, and research emerging digital frameworks.",
      icon: Lightbulb,
      color: "text-amber-400",
    },
    {
      title: "Community",
      description: "Creating opportunities for peer collaboration, workshops, and knowledge sharing.",
      icon: Users,
      color: "text-sky-400",
    },
  ];

  return (
    <section className="py-20 bg-[#090f1d] border-b border-slate-800/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            What We Do
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Our core focus areas driving student growth and technical capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillarList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="pro-dark-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center ${item.color} mb-4`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
