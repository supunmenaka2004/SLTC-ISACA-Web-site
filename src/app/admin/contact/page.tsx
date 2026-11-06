"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  Search,
  CheckCircle,
  Clock,
  Archive,
  Trash2,
  ExternalLink,
  Phone,
  MapPin,
  Save,
  Check,
  X,
  Eye,
  Inbox,
  Send,
} from "lucide-react";
import { ContactMessage, SiteSettings } from "@/server/db/schema";

export default function ContactManagementPage() {
  const [activeTab, setActiveTab] = useState<"inbox" | "details">("inbox");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [notesText, setNotesText] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Settings State for Contact Details
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    try {
      const [msgRes, setRes] = await Promise.all([
        fetch("/api/contact"),
        fetch("/api/admin/settings"),
      ]);

      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData.messages || []);
      }

      if (setRes.ok) {
        const setData = await setRes.json();
        setSettings(setData.settings);
      }
    } catch {
      showToast("Failed to load contact data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateMessageStatus = async (id: string, status: ContactMessage["status"], notes?: string) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, notes }),
      });

      if (res.ok) {
        showToast("Message status updated");
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status, notes: notes !== undefined ? notes : m.notes } : m))
        );
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status, notes: notes !== undefined ? notes : prev.notes } : null));
        }
      } else {
        showToast("Failed to update message status", "error");
      }
    } catch {
      showToast("Network error", "error");
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this inquiry?")) return;

    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showToast("Inquiry removed");
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
      } else {
        showToast("Failed to remove message", "error");
      }
    } catch {
      showToast("Network error", "error");
    }
  };

  const handleSaveContactDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        showToast("Contact information updated successfully!");
      } else {
        showToast("Failed to update contact info", "error");
      }
    } catch {
      showToast("Network error while saving", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchesFilter = activeFilter === "all" ? true : m.status === activeFilter;
    const matchesQuery =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.studentId && m.studentId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesQuery;
  });

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border animate-in slide-in-from-top-2 ${
            toast.type === "success"
              ? "bg-[#06201a] text-emerald-300 border-emerald-500/40"
              : "bg-[#250d11] text-rose-300 border-rose-500/40"
          }`}
        >
          {toast.type === "success" ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-rose-400" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-cyan-400" />
            <span>Contact &amp; Inquiries Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage public website contact information and respond to submitted inquiries.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex p-1 rounded-lg bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "inbox"
                ? "bg-cyan-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Inquiries Inbox</span>
            {unreadCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === "inbox" ? "bg-slate-950 text-cyan-400" : "bg-cyan-500 text-slate-950"
              }`}>
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("details")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "details"
                ? "bg-cyan-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Contact Information</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INBOX */}
      {activeTab === "inbox" && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All Messages" },
                { id: "unread", label: "Unread" },
                { id: "read", label: "Read" },
                { id: "responded", label: "Replied" },
                { id: "archived", label: "Archived" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    activeFilter === f.id
                      ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40"
                      : "bg-[#090f1d] text-slate-400 border border-slate-800 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inquiries..."
                className="w-full bg-[#060c18] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Messages Table */}
          <div className="bg-[#090f1d] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            {loading ? (
              <div className="py-16 text-center text-slate-400">
                <div className="w-7 h-7 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span className="text-xs font-mono uppercase">Loading Inquiries...</span>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Inbox className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs">No inquiries matching your filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c1527] text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Sender</th>
                      <th className="py-3 px-4">Message Preview</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredMessages.map((msg) => (
                      <tr
                        key={msg.id}
                        className={`hover:bg-slate-800/30 transition-colors ${
                          msg.status === "unread" ? "bg-cyan-950/10 font-semibold" : ""
                        }`}
                      >
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                              msg.status === "unread"
                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                                : msg.status === "responded"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : msg.status === "archived"
                                ? "bg-slate-800 text-slate-400"
                                : "bg-slate-800/60 text-slate-300"
                            }`}
                          >
                            {msg.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{msg.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{msg.email}</div>
                          {msg.studentId && (
                            <div className="text-[10px] text-cyan-400 font-mono">ID: {msg.studentId}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <p className="line-clamp-2 text-slate-300 text-xs max-w-md">
                            {msg.message}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedMessage(msg);
                                setNotesText(msg.notes || "");
                                if (msg.status === "unread") {
                                  updateMessageStatus(msg.id, "read");
                                }
                              }}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => deleteMessage(msg.id)}
                              className="p-1 rounded hover:bg-red-950/40 text-slate-500 hover:text-red-400 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CONTACT DETAILS & LOCATION */}
      {activeTab === "details" && settings && (
        <form onSubmit={handleSaveContactDetails} className="space-y-6">
          <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Public Contact Channels
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  placeholder="contact@isaca.sltc.lk"
                  className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  placeholder="+94 11 210 0500"
                  className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase">
                Campus Location Address
              </label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="School of Computing, Sri Lanka Technology Campus..."
                className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Official Social Media Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">LinkedIn Profile / Page</label>
                <input
                  type="url"
                  value={settings.socials.linkedin || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socials: { ...settings.socials, linkedin: e.target.value },
                    })
                  }
                  className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">GitHub Organization</label>
                <input
                  type="url"
                  value={settings.socials.github || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socials: { ...settings.socials, github: e.target.value },
                    })
                  }
                  className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Instagram Account</label>
                <input
                  type="url"
                  value={settings.socials.instagram || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socials: { ...settings.socials, instagram: e.target.value },
                    })
                  }
                  className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">YouTube Channel</label>
                <input
                  type="url"
                  value={settings.socials.youtube || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socials: { ...settings.socials, youtube: e.target.value },
                    })
                  }
                  className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? "Saving Changes..." : "Save Contact Details"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Message View Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#090f1d] border border-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">{selectedMessage.name}</h3>
                <span className="text-xs text-cyan-400 font-mono">{selectedMessage.email}</span>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#060c18] border border-slate-800/80 text-xs text-slate-200 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
              {selectedMessage.message}
            </div>

            {/* Reviewer Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
                Internal Reviewer Notes
              </label>
              <textarea
                rows={2}
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Add private note for administrative records..."
                className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=RE: Inquiry from ${encodeURIComponent(selectedMessage.name)}`}
                  className="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
                <button
                  type="button"
                  onClick={() => updateMessageStatus(selectedMessage.id, "archived", notesText)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Archive
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  updateMessageStatus(selectedMessage.id, selectedMessage.status, notesText);
                  setSelectedMessage(null);
                }}
                className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium"
              >
                Save Notes &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
