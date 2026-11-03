"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedNetwork from "./AnimatedNetwork";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[88vh] lg:min-h-screen flex items-center overflow-hidden bg-[#02060d] font-sans">
      
      {/* Pitch Dark Animated Digital Network Background Canvas */}
      <AnimatedNetwork />

      {/* Keep the animated network visible while giving the copy a calm reading area. */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#02060d]/95 via-[#02060d]/75 to-[#02060d]/15" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#02060d]/35 via-transparent to-[#02060d]/55" />

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col items-start justify-center pt-28 pb-20">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-5xl space-y-5 flex flex-col items-start"
        >
          {/* Keep the club name prominent while letting the background carry the motion. */}
          <h1 className="text-[clamp(3rem,7.2vw,6rem)] font-bold tracking-[-0.055em] leading-[0.98]">
            <span className="bg-gradient-to-r from-[#13b5d1] via-[#29b99b] to-[#78be20] bg-clip-text text-transparent font-extrabold">
              ISACA
            </span>{" "}
            <span className="text-white font-semibold tracking-[-0.045em]">
              Student Group
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl font-medium text-slate-200 tracking-[-0.025em] max-w-3xl pt-1">
            Sri Lanka Technology Campus
          </p>

          {/* CTA Button: Rectangular Outlined Button with Cyan Border */}
          <div className="pt-5 flex justify-start">
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-6 py-3 text-xs sm:text-sm font-semibold text-slate-100 uppercase tracking-[0.14em] bg-[#02060d]/70 border border-cyan-400/80 hover:border-cyan-300 hover:bg-cyan-500/10 hover:text-white transition-colors duration-300 rounded-sm cursor-pointer"
            >
              MORE DETAILS
            </Link>
          </div>
        </motion.div>

      </div>

    </section>
  );
}
