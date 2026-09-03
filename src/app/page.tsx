"use client";

import Hero from "@/components/Hero";
import AboutPreview from "@/components/AboutPreview";
import TeamPreview from "@/components/TeamPreview";
import UpcomingEventsSection from "@/components/UpcomingEventsSection";
import CyberNewsEditorialSection from "@/components/CyberNewsEditorialSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#070d19] text-white">
      
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Who We Are: About Preview Section */}
      <AboutPreview />

      {/* 3. Our Team Preview Section */}
      <TeamPreview />

      {/* 4. Featured Upcoming Events Section - 55/45 Split Layout with Bottom-Right Arrow Navigation */}
      <UpcomingEventsSection />

      {/* 5. Latest Cyber News Section - Publication Editorial Layout */}
      <CyberNewsEditorialSection />

    </div>
  );
}
