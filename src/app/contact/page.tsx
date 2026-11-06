"use client";

import { useEffect, useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle, Loader2 } from "lucide-react";
import { getPublicSiteData } from "@/lib/siteDataClient";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [contactInfo, setContactInfo] = useState({
    address: "School of Computing, University Main Campus, Academic Block 02, Room 304.",
    email: "contact@isacaclub.org",
    phone: "+94 (0) 11 210 0500",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadContactInfo() {
      try {
        const data = await getPublicSiteData();
        if (data?.siteSettings) {
          setContactInfo({
            address: data.siteSettings.address || contactInfo.address,
            email: data.siteSettings.contactEmail || contactInfo.email,
            phone: data.siteSettings.contactPhone || contactInfo.phone,
          });
        }
      } catch {}
    }
    loadContactInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || "Failed to submit inquiry. Please try again.");
      }
    } catch {
      setErrorMsg("Network error occurred. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 font-sans bg-[#070d19] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title Header */}
        <div className="mb-12 pb-8 border-b border-white/10">
          <div className="inline-block px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3 font-mono border border-cyan-500/20">
            Official Contact
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Get In Touch
          </h1>
          <p className="text-slate-300 text-base mt-2 max-w-2xl">
            Have questions regarding ISACA Student Group membership, workshops, or academic partnerships? Contact our executive team.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Information */}
          <div className="lg:col-span-5 space-y-6 glass-card rounded-xl p-8 border border-white/10">
            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-3 font-mono">
              Contact Information
            </h2>

            <div className="space-y-5 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block mb-0.5">Campus Location</span>
                  <span className="whitespace-pre-line leading-relaxed">{contactInfo.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block mb-0.5">Email Inquiries</span>
                  <a href={`mailto:${contactInfo.email}`} className="text-cyan-400 hover:underline font-mono">
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block mb-0.5">University Office Line</span>
                  <span className="font-mono">{contactInfo.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-xs text-slate-400 font-mono">
              Office Hours: Monday – Friday (09:00 AM – 04:30 PM)
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-8 border border-cyan-500/20 rounded-xl">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6 font-mono">
                  
                  {errorMsg && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-md text-xs text-rose-400 font-sans">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Your Name <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Jane Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-md bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Email Address <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. jane@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-md bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Membership Inquiry / Event Sponsorship"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-md bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Message <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Type your inquiry message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-md bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 text-xs font-bold text-[#070d19] bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 transition-colors rounded-md shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                </form>
              ) : (
                <div className="text-center py-12 space-y-3 font-mono">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Message Sent Successfully</h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto font-sans">
                    Thank you, <span className="font-semibold text-white">{formData.name}</span>. Your message has been received by the ISACA Student Group committee.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", message: "" });
                    }}
                    className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 rounded-md transition-colors cursor-pointer border border-white/10"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
