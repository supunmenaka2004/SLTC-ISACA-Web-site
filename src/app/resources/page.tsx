"use client";

import { useState } from "react";
import ResourceCard from "@/components/ResourceCard";
import { resourcesData } from "@/data/resourcesData";

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<string>("All");

  const categories = [
    "All",
    "Cybersecurity",
    "Networking",
    "Programming",
    "Ethical Hacking",
    "Research",
    "Learning Materials",
  ];

  const filteredResources = resourcesData.filter((res) =>
    activeTab === "All" ? true : res.category === activeTab
  );

  return (
    <div className="pt-32 pb-24 font-sans bg-[#070d19] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title Header */}
        <div className="mb-12 pb-8 border-b border-white/10">
          <div className="inline-block px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3 font-mono border border-cyan-500/20">
            Academic Knowledge Hub
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Resources
          </h1>
          <p className="text-slate-300 text-base mt-2 max-w-2xl">
            Curated learning guides, protocol documentation, coding standards, and research materials for university students.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 font-mono">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === cat
                  ? "bg-cyan-400 text-[#070d19] font-bold shadow-md"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>

      </div>
    </div>
  );
}
