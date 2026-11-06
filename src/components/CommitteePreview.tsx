"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { committeeData, CommitteeMember } from "@/data/committeeData";
import CommitteeCard from "./CommitteeCard";
import WordColoredHeading from "./WordColoredHeading";
import DynamicIcon from "./DynamicIcon";
import { WordColor } from "@/server/db/schema";
import { getPublicSiteData } from "@/lib/siteDataClient";

export default function CommitteePreview() {
  const [membersList, setMembersList] = useState<CommitteeMember[]>(committeeData);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [titleConfig, setTitleConfig] = useState<{
    kicker: string;
    icon: string;
    title: string;
    words?: WordColor[];
    ctaText: string;
    desc: string;
  }>({
    kicker: "LEADERSHIP & COMMITTEE",
    icon: "Award",
    title: "Our Committee",
    words: [
      { text: "Our", color: "#ffffff" },
      { text: "Committee", color: "#22d3ee" },
    ],
    ctaText: "VIEW FULL COMMITTEE ROSTER",
    desc: "Meet the student officials guiding ISACA Student Group towards academic excellence, technical innovation, and digital security awareness.",
  });

  useEffect(() => {
    async function loadCommittee() {
      try {
        const data = await getPublicSiteData();
        if (data?.committee && data.committee.length > 0) {
          setMembersList(data.committee);
        }
        if (data?.homepage) {
          setTitleConfig({
            kicker: data.homepage.committeePreviewKicker || "LEADERSHIP & COMMITTEE",
            icon: data.homepage.committeePreviewIcon || "Award",
            title: data.homepage.committeePreviewTitle || "Our Committee",
            words: data.homepage.committeePreviewTitleWords,
            ctaText: data.homepage.committeePreviewCtaText || "VIEW FULL COMMITTEE ROSTER",
            desc: data.homepage.committeePreviewDesc || "Meet the student officials guiding ISACA Student Group towards academic excellence, technical innovation, and digital security awareness.",
          });
        }
      } catch {}
    }
    loadCommittee();
  }, []);

  const categories = ["All", "Executive", "Technical", "Operations"];

  const filteredMembers = membersList
    .filter((member) => (activeCategory === "All" ? true : member.category === activeCategory))
    .slice(0, 4); // Display top 4 in preview

  return (
    <section className="bg-[#050A14] py-24 sm:py-28 font-sans border-b border-slate-800/40 relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-3 text-cyan-300/90 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] mb-4">
              <DynamicIcon name={titleConfig.icon || "Award"} className="w-3.5 h-3.5 text-cyan-400" />
              <span className="h-px w-7 bg-cyan-500/70" />
              <span>{titleConfig.kicker}</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-semibold tracking-[-0.045em] leading-tight">
              <WordColoredHeading
                words={titleConfig.words}
                rawText={titleConfig.title}
                defaultColor="#ffffff"
                highlightColor="#22d3ee"
              />
            </h2>

            <div className="h-px w-16 bg-cyan-400/80 my-5" />

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              {titleConfig.desc}
            </p>
          </div>

          {/* Link to Full Committee Page */}
          <Link
            href="/committee"
            className="inline-flex items-center gap-2 border-b border-cyan-500/50 pb-1.5 text-cyan-200 hover:border-cyan-300 hover:text-white font-semibold text-xs sm:text-sm uppercase tracking-[0.12em] transition-colors duration-300 group shrink-0"
          >
            <span>{titleConfig.ctaText || "VIEW FULL COMMITTEE ROSTER"}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1 text-cyan-400" />
          </Link>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Committee Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredMembers.map((member) => (
            <CommitteeCard key={member.id} member={member} />
          ))}
        </div>

      </div>
    </section>
  );
}
