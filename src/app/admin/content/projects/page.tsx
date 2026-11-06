"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink,
  Code2,
  Tag,
} from "lucide-react";
import { ProjectItem } from "@/server/db/schema";
import DirectImageUpload from "@/components/admin/DirectImageUpload";

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [activeStatus, setActiveStatus] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectItem["status"]>("Active");
  const [technologiesText, setTechnologiesText] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [image, setImage] = useState("");

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const loadProjects = async () => {
    try {
      const res = await fetch("/api/admin/content/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch {
      showToast("Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setName("");
    setCategory("Security Tool");
    setDescription("");
    setStatus("Active");
    setTechnologiesText("Next.js, TypeScript, Docker");
    setGithubUrl("https://github.com");
    setDemoUrl("");
    setImage("");
    setModalOpen(true);
  };

  const openEditModal = (p: ProjectItem) => {
    setEditingProject(p);
    setName(p.name);
    setCategory(p.category);
    setDescription(p.description);
    setStatus(p.status);
    setTechnologiesText(p.technologies?.join(", ") || "");
    setGithubUrl(p.githubUrl || "");
    setDemoUrl(p.demoUrl || "");
    setImage(p.image || "");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category.trim() || !description.trim()) return;

    const payload = {
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      status,
      technologies: technologiesText.split(",").map((t) => t.trim()).filter(Boolean),
      githubUrl: githubUrl.trim() || undefined,
      demoUrl: demoUrl.trim() || undefined,
      image: image.trim() || undefined,
    };

    try {
      if (editingProject) {
        const res = await fetch("/api/admin/content/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProject.id, ...payload }),
        });
        if (res.ok) {
          showToast(`Project '${name}' updated!`);
          setModalOpen(false);
          await loadProjects();
        } else {
          showToast("Failed to update project", "error");
        }
      } else {
        const res = await fetch("/api/admin/content/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast(`Project '${name}' added!`);
          setModalOpen(false);
          await loadProjects();
        } else {
          showToast("Failed to add project", "error");
        }
      }
    } catch {
      showToast("Network error saving project", "error");
    }
  };

  const handleDelete = async (id: string, projectName: string) => {
    if (!confirm(`Delete project '${projectName}'?`)) return;

    try {
      const res = await fetch(`/api/admin/content/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast(`Project '${projectName}' removed!`);
        await loadProjects();
      } else {
        showToast("Failed to remove project", "error");
      }
    } catch {
      showToast("Network error deleting project", "error");
    }
  };

  const filtered = projects.filter((p) =>
    activeStatus === "All" ? true : p.status === activeStatus
  );

  if (loading) {
    return (
      <div className="py-20 flex justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-950/80 border border-blue-500/30 text-blue-300 text-[10px] font-mono uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            <span>STUDENT INNOVATION &amp; CTF LABS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Projects Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Showcase student-built software tools, CTF competition portals, static analyzer utilities, and security research sandboxes.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-lg border text-xs font-medium flex items-center gap-2.5 ${
            message.type === "success"
              ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
              : "bg-rose-950/60 border-rose-500/40 text-rose-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 font-mono text-xs">
        {["All", "Active", "Completed", "Ongoing"].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setActiveStatus(st)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeStatus === st
                ? "bg-cyan-500 text-slate-950 font-bold"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="bg-[#090f1d] border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all shadow-md group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold uppercase text-cyan-400">{proj.category}</span>
                <span
                  className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                    proj.status === "Active"
                      ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                      : proj.status === "Ongoing"
                      ? "bg-yellow-950 text-yellow-300 border-yellow-500/40"
                      : "bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  {proj.status}
                </span>
              </div>

              <h4 className="text-base font-bold text-white leading-snug">{proj.name}</h4>
              <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">{proj.description}</p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {proj.technologies?.map((tech, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                    title="Source Repository"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                  </a>
                )}
                {proj.demoUrl && (
                  <a
                    href={proj.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800"
                    title="Live Demo"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(proj)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 font-semibold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(proj.id, proj.name)}
                  className="p-1 text-slate-500 hover:text-rose-400"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Edit / Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingProject ? `Edit Project: ${editingProject.name}` : "Add New Student Project"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Live Preview Box */}
              <div className="p-3 rounded-xl bg-[#060c18] border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                    Live Project Preview
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{status}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0a1122] border border-slate-800 flex items-center gap-3">
                  <div className="w-16 h-12 rounded bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Code2 className="w-5 h-5 text-cyan-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-white text-xs block truncate">{name || "Project Title"}</span>
                    <span className="text-[10px] text-cyan-400 font-mono block">{category || "Category"}</span>
                    <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{description || "Project summary"}</span>
                  </div>
                </div>
              </div>

              {/* Direct Cover Image Uploader */}
              <DirectImageUpload
                value={image}
                onChange={setImage}
                category="project"
                label="Project Cover Image"
                aspectHint="16:9 banner or screenshot, up to 5MB"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">Project Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">Category *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Competition Portal, Security Tool"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProjectItem["status"])}
                    className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Active">Active</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
                  Technologies (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, TypeScript, Docker, OWASP ZAP"
                  value={technologiesText}
                  onChange={(e) => setTechnologiesText(e.target.value)}
                  className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">GitHub Repository URL</label>
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">Live Demo / Portal URL</label>
                  <input
                    type="text"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
