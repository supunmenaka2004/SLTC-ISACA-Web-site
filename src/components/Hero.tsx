"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedNetwork from "./AnimatedNetwork";

export default function Hero() {
  const [heroConfig, setHeroConfig] = useState({
    heroTitle: "ISACA",
    heroHighlight: "Student Group",
    heroSubtitle: "Sri Lanka Technology Campus",
    heroCtaText: "MORE DETAILS",
    heroCtaLink: "/about-us",
  });

  useEffect(() => {
    async function loadHero() {
      try {
        const res = await fetch("/api/public/site-data", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.homepage) {
            setHeroConfig({
              heroTitle: data.homepage.heroTitle || "ISACA",
              heroHighlight: data.homepage.heroHighlight || "Student Group",
              heroSubtitle: data.homepage.heroSubtitle || "Sri Lanka Technology Campus",
              heroCtaText: data.homepage.heroCtaText || "MORE DETAILS",
              heroCtaLink: data.homepage.heroCtaLink || "/about-us",
            });
          }
        }
      } catch {}
    }
    loadHero();
  }, []);

  return (
    <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#02060d] font-sans">
      
      {/* Pitch Dark Animated Digital Network Background Canvas */}
      <AnimatedNetwork />

      {/* Subtle Ambient Vignette - keeps text readable while letting network animation shine vibrantly */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#02060d]/20 via-transparent to-[#02060d]/60 pointer-events-none" />
      <div className="absolute inset-0 z-[1] [background:radial-gradient(ellipse_at_center,rgba(2,6,13,0.15)_0%,rgba(2,6,13,0.6)_100%)] pointer-events-none" />

      {/* Hero Content Container - Perfectly Centered */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col items-center justify-center text-center pt-28 pb-20">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-4xl space-y-5 flex flex-col items-center text-center"
        >
          {/* Main Heading Matching Brand Gradient */}
          <h1 className="text-[clamp(2.85rem,7vw,5.5rem)] font-bold tracking-[-0.035em] leading-[1.08] text-center drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
            <span className="inline-block bg-gradient-to-r from-[#13b5d1] via-[#29b99b] to-[#78be20] bg-clip-text text-transparent font-extrabold pr-2 sm:pr-3 py-0.5">
              {heroConfig.heroTitle}
            </span>{" "}
            <span className="text-white font-semibold tracking-[-0.035em]">
              {heroConfig.heroHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl font-medium text-slate-100 tracking-[-0.02em] max-w-2xl mx-auto pt-1 text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {heroConfig.heroSubtitle}
          </p>

          {/* CTA Button: Centered */}
          <div className="pt-6 flex justify-center">
            <Link
              href={heroConfig.heroCtaLink}
              className="inline-flex items-center justify-center px-8 py-3.5 text-xs sm:text-sm font-semibold text-slate-100 uppercase tracking-[0.14em] bg-[#02060d]/80 border border-cyan-400/80 hover:border-cyan-300 hover:bg-cyan-500/10 hover:text-white transition-all duration-300 rounded-sm cursor-pointer shadow-[0_4px_20px_rgba(6,182,212,0.2)]"
            >
              {heroConfig.heroCtaText}
            </Link>
          </div>
        </motion.div>

      </div>

    </section>
  );
}
