"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  X,
  ArrowUp,
  ArrowDown,
  Mail,
  Search,
} from "lucide-react";
import DirectImageUpload from "@/components/admin/DirectImageUpload";
import { CommitteeMember } from "@/server/db/schema";

export default function CommitteeManagementPage() {
  const [committee, setCommittee] = useState<CommitteeMember[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [initials, setInitials] = useState("");
  const [category, setCategory] = useState<CommitteeMember["category"]>("Executive");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("https://linkedin.com");
  const [github, setGithub] = useState("");
  const [instagram, setInstagram] = useState("");
  const [image, setImage] = useState("");

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const loadCommittee = async () => {
    try {
      const res = await fetch("/api/admin/content/committee");
      if (res.ok) {
        const data = await res.json();
        setCommittee(data.committee || []);
      }
    } catch {
      showToast("Failed to load committee members", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommittee();
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setName("");
    setPosition("");
    setInitials("");
    setCategory("Executive");
    setBio("");
    setEmail("committee@isacaclub.org");
    setLinkedin("https://linkedin.com");
    setGithub("");
    setInstagram("");
    setImage("");
    setModalOpen(true);
  };

  const openEditModal = (m: CommitteeMember) => {
    setEditingMember(m);
    setName(m.name);
    setPosition(m.position);
    setInitials(m.initials);
    setCategory(m.category);
    setBio(m.bio);
    setEmail(m.email);
    setLinkedin(m.linkedin);
    setGithub(m.github || "");
    setInstagram(m.instagram || "");
    setImage(m.image || "");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !position.trim()) return;

    const payload = {
      name: name.trim(),
      position: position.trim(),
      initials: initials.trim() || name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 3),
      category,
      bio: bio.trim(),
      email: email.trim(),
      linkedin: linkedin.trim(),
      github: github.trim() || undefined,
      instagram: instagram.trim() || undefined,
      image: image.trim() || undefined,
    };

    try {
      if (editingMember) {
        const res = await fetch("/api/admin/content/committee", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingMember.id, ...payload }),
        });
        if (res.ok) {
          showToast(`Member '${name}' updated!`);
          setModalOpen(false);
          await loadCommittee();
        } else {
          showToast("Failed to update member", "error");
        }
      } else {
        const res = await fetch("/api/admin/content/committee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast(`Member '${name}' added!`);
          setModalOpen(false);
          await loadCommittee();
        } else {
          showToast("Failed to add member", "error");
        }
      }
    } catch {
      showToast("Network error saving committee member", "error");
    }
  };

  const handleDelete = async (id: string, memberName: string) => {
    if (!confirm(`Delete committee member '${memberName}'?`)) return;

    try {
      const res = await fetch(`/api/admin/content/committee?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast(`Member '${memberName}' removed!`);
        await loadCommittee();
      } else {
        showToast("Failed to remove member", "error");
      }
    } catch {
      showToast("Network error deleting member", "error");
    }
  };

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= committee.length) return;

    const updated = [...committee];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const reordered = updated.map((m, idx) => ({ id: m.id, order: idx + 1 }));
    setCommittee(updated);

    try {
      await fetch("/api/admin/content/committee", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members: reordered }),
      });
      showToast("Display ordering updated!");
    } catch {
      showToast("Failed to save reordered list", "error");
    }
  };

  const filtered = committee.filter((m) => {
    const matchesCat = activeCategory === "All" ? true : m.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.bio && m.bio.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

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
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>CENTRAL LEADERSHIP &amp; COMMITTEE DIRECTORY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Committee &amp; Leadership Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage all student officials, update photos, positions, categories, and adjust display ordering.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Committee Member</span>
        </button>
      </div>

      {/* Unified Directory Banner */}
      <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-xl p-4 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-white font-medium">
              Unified Team &amp; Committee System
            </p>
            <p className="text-slate-400 text-[11px] mt-0.5">
              All club members are managed here. Officials in the <strong className="text-cyan-300">Executive</strong> category automatically power the Executive Board showcase on the Homepage.
            </p>
          </div>
        </div>
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

      {/* Filters and Search Bar Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto pb-1 sm:pb-0">
          {["All", "Executive", "Technical", "Operations"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search member by name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#030712] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((member, index) => (
          <div
            key={member.id}
            className="bg-[#090f1d] border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all shadow-md group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-300 flex items-center justify-center font-bold text-sm uppercase shrink-0">
                  {member.initials || "IS"}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 uppercase">
                    {member.category}
                  </span>
                  <div className="flex items-center">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveOrder(index, "up")}
                      className="p-1 text-slate-500 hover:text-white disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === committee.length - 1}
                      onClick={() => moveOrder(index, "down")}
                      className="p-1 text-slate-500 hover:text-white disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <h4 className="text-base font-bold text-white">{member.name}</h4>
              <p className="text-xs text-cyan-400 font-mono font-medium">{member.position}</p>
              <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">{member.bio}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">{member.email}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(member)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 font-semibold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(member.id, member.name)}
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

      {/* Member Edit / Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingMember ? `Edit Member: ${editingMember.name}` : "Add Committee Member"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Live Preview Box */}
              <div className="p-4 rounded-xl bg-[#060c18] border border-slate-800/80">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                    Live Member Preview
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Live appearance</span>
                </div>
                <div className="max-w-xs mx-auto p-4 rounded-xl bg-[#0a1122] border border-slate-800 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400/50 shadow-md mb-2 bg-slate-800 flex items-center justify-center font-bold text-white text-sm">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span>{initials || "IS"}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-sm">{name || "Member Name"}</h3>
                  <span className="text-xs text-cyan-400 font-mono">{position || "Executive Position"}</span>
                  <span className="mt-1 text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-mono uppercase">
                    {category}
                  </span>
                </div>
              </div>

              {/* Direct Photo Uploader */}
              <DirectImageUpload
                value={image}
                onChange={setImage}
                category="committee"
                label="Profile Photograph"
                aspectHint="Square photo recommended, up to 5MB"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">Position *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. President, Vice President"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CommitteeMember["category"])}
                    className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Executive">Executive</option>
                    <option value="Technical">Technical</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">Initials (2-3 Chars)</label>
                  <input
                    type="text"
                    value={initials}
                    onChange={(e) => setInitials(e.target.value.toUpperCase())}
                    className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white uppercase font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">Biography</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">Official Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">LinkedIn URL</label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">GitHub URL (Optional)</label>
                  <input
                    type="text"
                    value={github}
                    placeholder="https://github.com/..."
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">Instagram URL (Optional)</label>
                  <input
                    type="text"
                    value={instagram}
                    placeholder="https://instagram.com/..."
                    onChange={(e) => setInstagram(e.target.value)}
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
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
