"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { projectsData } from "@/data/projectsData";

export default function ProjectsPage() {
  const [activeStatus, setActiveStatus] = useState<string>("All");

  const statuses = ["All", "Active", "Completed", "Ongoing"];

  const filteredProjects = projectsData.filter((proj) =>
    activeStatus === "All" ? true : proj.status === activeStatus
  );

  return (
    <div className="pt-32 pb-24 font-sans bg-[#070d19] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title Header */}
        <div className="mb-12 pb-8 border-b border-white/10">
          <div className="inline-block px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3 font-mono border border-cyan-500/20">
            Student Innovation & Development
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Our Projects
          </h1>
          <p className="text-slate-300 text-base mt-2 max-w-2xl">
            Discover student-built software tools, CTF competition portals, static analyzer utilities, and security research sandboxes.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 font-mono">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeStatus === st
                  ? "bg-cyan-400 text-[#070d19] font-bold shadow-md"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-white/5"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

      </div>
    </div>
  );
}
