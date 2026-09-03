"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPreview() {
  return (
    <section className="bg-[#050A14] py-24 font-sans border-b border-slate-800/40 relative overflow-hidden">
      
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
            className="lg:col-span-6 flex flex-col items-start justify-center"
          >
            {/* Category Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-4 shadow-sm backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>ABOUT OUR ORGANIZATION</span>
            </div>

            {/* Prominent Large Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-[48px] font-extrabold text-white tracking-tight leading-[1.15]">
              Who <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">We Are</span>
            </h2>

            {/* Cyan Gradient Underline Accent Bar */}
            <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full my-4" />

            {/* Paragraph with Refined Spacing */}
            <p className="text-slate-300 text-base sm:text-lg leading-[1.8] font-normal mt-2">
              <strong className="text-white font-semibold">ICASA Club</strong> is an official university student organization dedicated to empowering students with practical <span className="text-cyan-300 font-medium">cybersecurity knowledge</span>, technical skills, <span className="text-cyan-300 font-medium">ethical hacking awareness</span>, and research opportunities. We bridge academic foundations with industry technology standards.
            </p>

            {/* Styled Read More CTA Link */}
            <div className="mt-8">
              <Link
                href="/about-us"
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-md group"
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
            className="lg:col-span-6 w-full"
          >
            <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900 shadow-2xl group">
              <img
                src="/about.jpg"
                alt="ICASA Club Student Cybersecurity Team at Sri Lanka Technology Campus"
                className="w-full h-auto block rounded-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
              />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
