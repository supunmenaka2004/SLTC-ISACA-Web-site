"use client";

import { useEffect, useState } from "react";
import CommitteeCard from "@/components/CommitteeCard";
import { committeeData, CommitteeMember } from "@/data/committeeData";

export default function CommitteePage() {
  const [membersList, setMembersList] = useState<CommitteeMember[]>(committeeData);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    async function loadLiveCommittee() {
      try {
        const res = await fetch("/api/public/site-data", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.committee && data.committee.length > 0) {
            setMembersList(data.committee);
          }
        }
      } catch {}
    }
    loadLiveCommittee();
  }, []);

  const categories = ["All", "Executive", "Technical", "Operations"];

  const filteredMembers = membersList.filter((member) =>
    activeCategory === "All" ? true : member.category === activeCategory
  );

  return (
    <div className="pt-32 pb-24 font-sans bg-[#070d19] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title Header */}
        <div className="mb-12 pb-8 border-b border-white/10 text-center max-w-3xl mx-auto">
          <div className="inline-block px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3 font-mono border border-cyan-500/20">
            Leadership & Executive Body
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Our Committee
          </h1>
          <p className="text-slate-300 text-base mt-2">
            Meet the student officials guiding ISACA Student Group towards academic excellence, innovation, and digital security awareness.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 font-mono">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeCategory === cat
                  ? "bg-cyan-400 text-[#070d19] font-bold shadow-md"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Profile Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <CommitteeCard key={member.id} member={member} />
          ))}
        </div>

      </div>
    </div>
  );
}
