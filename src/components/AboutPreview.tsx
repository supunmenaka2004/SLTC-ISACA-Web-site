"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import WordColoredHeading from "./WordColoredHeading";
import DynamicIcon from "./DynamicIcon";
import { WordColor } from "@/server/db/schema";
import { getPublicSiteData } from "@/lib/siteDataClient";

export default function AboutPreview() {
  const [aboutConfig, setAboutConfig] = useState<{
    aboutPreviewTitle: string;
    aboutPreviewTitleWords?: WordColor[];
    aboutPreviewKicker: string;
    aboutPreviewIcon: string;
    aboutPreviewDesc: string;
    aboutPreviewCtaText: string;
    aboutPreviewCtaLink: string;
    aboutPreviewImage: string;
  }>({
    aboutPreviewTitle: "Who We Are",
    aboutPreviewTitleWords: undefined,
    aboutPreviewKicker: "ABOUT OUR ORGANIZATION",
    aboutPreviewIcon: "ShieldCheck",
    aboutPreviewDesc: "ISACA Student Group is an official university student organization dedicated to empowering students with practical cybersecurity knowledge, technical skills, ethical hacking awareness, and research opportunities. We bridge academic foundations with industry technology standards.",
    aboutPreviewCtaText: "READ MORE ABOUT OUR MISSION",
    aboutPreviewCtaLink: "/about-us",
    aboutPreviewImage: "/about.jpg",
  });

  useEffect(() => {
    async function loadAboutPreview() {
      try {
        const data = await getPublicSiteData();
        if (data?.homepage) {
          setAboutConfig({
            aboutPreviewTitle: data.homepage.aboutPreviewTitle || "Who We Are",
            aboutPreviewTitleWords: data.homepage.aboutPreviewTitleWords,
            aboutPreviewKicker: data.homepage.aboutPreviewKicker || "ABOUT OUR ORGANIZATION",
            aboutPreviewIcon: data.homepage.aboutPreviewIcon || "ShieldCheck",
            aboutPreviewDesc: data.homepage.aboutPreviewDesc || "ISACA Student Group is an official university student organization dedicated to empowering students with practical cybersecurity knowledge, technical skills, ethical hacking awareness, and research opportunities. We bridge academic foundations with industry technology standards.",
            aboutPreviewCtaText: data.homepage.aboutPreviewCtaText || "READ MORE ABOUT OUR MISSION",
            aboutPreviewCtaLink: data.homepage.aboutPreviewCtaLink || "/about-us",
            aboutPreviewImage: data.homepage.aboutPreviewImage || "/about.jpg",
          });
        }
      } catch {}
    }
    loadAboutPreview();
  }, []);

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
              <DynamicIcon name={aboutConfig.aboutPreviewIcon || "ShieldCheck"} className="w-4 h-4 text-cyan-400" />
              <span className="h-px w-7 bg-cyan-500/70" />
              <span>{aboutConfig.aboutPreviewKicker}</span>
            </div>

            {/* Prominent Large Heading with Word Colors */}
            <h2 className="text-[2.65rem] sm:text-5xl lg:text-[54px] font-semibold tracking-[-0.045em] leading-[1.08]">
              <WordColoredHeading
                words={aboutConfig.aboutPreviewTitleWords}
                rawText={aboutConfig.aboutPreviewTitle || "Who We Are"}
                defaultColor="#ffffff"
                highlightColor="#22d3ee"
              />
            </h2>

            <div className="h-px w-16 bg-cyan-400/80 my-5" />

            {/* Paragraph with Refined Spacing */}
            <p className="text-slate-300 text-base sm:text-[17px] leading-[1.85] font-normal mt-1 max-w-[39rem]">
              {aboutConfig.aboutPreviewDesc}
            </p>

            {/* Styled Read More CTA Link */}
            <div className="mt-8">
              <Link
                href={aboutConfig.aboutPreviewCtaLink}
                className="inline-flex items-center gap-3 border-b border-cyan-500/50 pb-2 text-cyan-200 hover:border-cyan-300 hover:text-white font-semibold text-xs sm:text-sm uppercase tracking-[0.12em] transition-colors duration-300 group"
              >
                <span>{aboutConfig.aboutPreviewCtaText}</span>
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
                src={aboutConfig.aboutPreviewImage}
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
