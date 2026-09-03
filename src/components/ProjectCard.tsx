"use client";

import { motion } from "framer-motion";
import { FolderGit2, ExternalLink } from "lucide-react";
import { ProjectItem } from "@/data/projectsData";

export default function ProjectCard({ project }: { project: ProjectItem }) {
  const getStatusBadge = (status: ProjectItem["status"]) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "Completed":
        return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
      case "Ongoing":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pro-dark-card p-6 flex flex-col justify-between"
    >
      <div>
        {/* Header: Title & Status */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-snug">
                {project.name}
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {project.category}
              </span>
            </div>
          </div>

          <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold border shrink-0 font-mono ${getStatusBadge(project.status)}`}>
            {project.status}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed my-3">
          {project.description}
        </p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-1.5 my-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[11px] font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
        {project.demoUrl ? (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
          >
            <span>View Project</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <a
            href={project.githubUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white transition-colors font-mono"
          >
            <span>View Documentation</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

    </motion.div>
  );
}
