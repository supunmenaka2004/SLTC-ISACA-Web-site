"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedNetwork from "./AnimatedNetwork";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#02060d] font-sans">
      
      {/* Pitch Dark Animated Digital Network Background Canvas */}
      <AnimatedNetwork />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center pt-24 pb-16">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-4 flex flex-col items-center"
        >
          {/* Main Heading Matching Exact Reference Image Font & Color Mix */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-[80px] font-black tracking-tight leading-none whitespace-nowrap">
            <span className="bg-gradient-to-r from-[#00a3e0] via-[#00b2a9] to-[#78be20] bg-clip-text text-transparent font-extrabold tracking-tight">
              ISACA
            </span>{" "}
            <span className="text-white font-extrabold tracking-tight">
              Student Group
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-2xl lg:text-[28px] font-semibold text-slate-200 tracking-tight max-w-3xl mx-auto pt-1">
            Sri Lanka Technology Campus
          </p>

          {/* CTA Button: Rectangular Outlined Button with Cyan Border */}
          <div className="pt-8 flex justify-center">
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-3.5 text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-widest bg-[#02060d]/80 border border-cyan-400 hover:border-cyan-300 hover:bg-cyan-500/10 hover:text-white transition-all duration-300 rounded-none shadow-lg cursor-pointer"
            >
              MORE DETAILS
            </Link>
          </div>
        </motion.div>

      </div>

    </section>
  );
}
