"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import AboutPreview from "@/components/AboutPreview";
import TeamPreview from "@/components/TeamPreview";
import CommitteePreview from "@/components/CommitteePreview";
import UpcomingEventsSection from "@/components/UpcomingEventsSection";
import CyberNewsEditorialSection from "@/components/CyberNewsEditorialSection";
import { getPublicSiteData } from "@/lib/siteDataClient";

const DEFAULT_ORDER = [
  "hero",
  "aboutPreview",
  "teamPreview",
  "committeePreview",
  "eventsPreview",
  "newsPreview",
];

export default function Home() {
  const [sectionOrder, setSectionOrder] = useState<string[]>(DEFAULT_ORDER);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    hero: true,
    aboutPreview: true,
    teamPreview: true,
    committeePreview: true,
    eventsPreview: true,
    newsPreview: true,
  });

  useEffect(() => {
    async function fetchHomeConfig() {
      try {
        const data = await getPublicSiteData();
        if (data?.homepage) {
          if (data.homepage.sectionOrder && Array.isArray(data.homepage.sectionOrder) && data.homepage.sectionOrder.length > 0) {
            setSectionOrder(data.homepage.sectionOrder);
          }
          if (data.homepage.visibleSections) {
            setVisibleSections(data.homepage.visibleSections);
          }
        }
      } catch {}
    }
    fetchHomeConfig();
  }, []);

  const renderSection = (key: string) => {
    if (visibleSections[key] === false) return null;

    switch (key) {
      case "hero":
        return <Hero key="hero" />;
      case "aboutPreview":
        return <AboutPreview key="aboutPreview" />;
      case "teamPreview":
        return <TeamPreview key="teamPreview" />;
      case "committeePreview":
        return <CommitteePreview key="committeePreview" />;
      case "eventsPreview":
        return <UpcomingEventsSection key="eventsPreview" />;
      case "newsPreview":
        return <CyberNewsEditorialSection key="newsPreview" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#070d19] text-white">
      {sectionOrder.map((sectionKey) => renderSection(sectionKey))}
    </div>
  );
}
