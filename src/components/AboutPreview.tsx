"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPreview() {
  return (
    <section className="bg-[#050A14] py-24 sm:py-28 font-sans border-b border-slate-800/40 relative overflow-hidden">
      
      {/* Subtle Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial 2-Column Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col items-start justify-center lg:pr-6"
          >
            {/* A simple editorial kicker keeps the section label clear without another pill. */}
            <div className="inline-flex items-center gap-3 text-cyan-300/90 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] mb-6">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="h-px w-7 bg-cyan-500/70" />
              <span>ABOUT OUR ORGANIZATION</span>
            </div>

            {/* Prominent Large Heading */}
            <h2 className="text-[2.65rem] sm:text-5xl lg:text-[54px] font-semibold text-white tracking-[-0.045em] leading-[1.08]">
              Who <span className="text-cyan-300">We Are</span>
            </h2>

            <div className="h-px w-16 bg-cyan-400/80 my-5" />

            {/* Paragraph with Refined Spacing */}
            <p className="text-slate-300 text-base sm:text-[17px] leading-[1.85] font-normal mt-1 max-w-[39rem]">
              <strong className="text-white font-semibold">ISACA Student Group</strong> is an official university student organization dedicated to empowering students with practical <span className="text-cyan-300 font-medium">cybersecurity knowledge</span>, technical skills, <span className="text-cyan-300 font-medium">ethical hacking awareness</span>, and research opportunities. We bridge academic foundations with industry technology standards.
            </p>

            {/* Styled Read More CTA Link */}
            <div className="mt-8">
              <Link
                href="/about-us"
                className="inline-flex items-center gap-3 border-b border-cyan-500/50 pb-2 text-cyan-200 hover:border-cyan-300 hover:text-white font-semibold text-xs sm:text-sm uppercase tracking-[0.12em] transition-colors duration-300 group"
              >
                <span>READ MORE ABOUT OUR MISSION</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1.5 text-cyan-400" />
              </Link>
            </div>
          </motion.div>

          {/* RIGHT SIDE IMAGE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 w-full lg:pl-4"
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden border border-slate-700/70 bg-slate-900 shadow-[0_24px_70px_-35px_rgba(0,0,0,0.9)] group">
              <img
                src="/about.jpg"
                alt="ISACA Student Group Cybersecurity Team at Sri Lanka Technology Campus"
                className="w-full h-full object-cover block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.015]"
              />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
