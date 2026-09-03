"use client";

import { useState } from "react";
import { Send, MapPin, Mail, Phone, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    message: "",
  });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      showToast("Your message was dispatched successfully! We will get in touch shortly.", "success");
      setFormData({ name: "", email: "", studentId: "", message: "" });
    }, 1500);
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  return (
    <section id="contact" className="section" style={{ overflow: "hidden" }}>
      <div style={{
        position: "absolute",
        left: 0,
        bottom: "25%",
        width: "20rem",
        height: "20rem",
        borderRadius: "9999px",
        backgroundColor: "rgba(0, 208, 116, 0.05)",
        filter: "blur(100px)",
        zIndex: -10
      }}></div>

      <div className="container">
        <div className="contact-grid">
          {/* Left Side: Contact Information */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "2rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <h2 className="section-subtitle">
                  Connect With Us
                </h2>
                <h3 className="section-title">
                  Start Your Cyber Journey
                </h3>
              </div>
              <p className="section-desc">
                Have questions about certifications, joining our Capture the Flag (CTF) teams, or corporate workshops? Get in touch with our committee.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", backgroundColor: "rgba(255, 255, 255, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255, 255, 255, 0.1)", color: "var(--isaca-green)", flexShrink: 0 }}>
                  <MapPin style={{ width: "1.25rem", height: "1.25rem" }} />
                </div>
                <div>
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#ffffff" }}>Campus Location</h4>
                  <p style={{ fontSize: "0.75rem", color: "var(--slate-400)", marginTop: "0.25rem", lineHeight: 1.5 }}>
                    School of Computing, SLTC Research University,<br />
                    Ingiriya Road, Padukka, Sri Lanka.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", backgroundColor: "rgba(255, 255, 255, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255, 255, 255, 0.1)", color: "var(--isaca-green)", flexShrink: 0 }}>
                  <Mail style={{ width: "1.25rem", height: "1.25rem" }} />
                </div>
                <div>
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#ffffff" }}>Official Communications</h4>
                  <a href="mailto:isaca@sltc.edu.lk" style={{ fontSize: "0.75rem", color: "var(--slate-400)", display: "block", marginTop: "0.25rem", fontFamily: "var(--font-mono)", textDecoration: "none" }}>
                    isaca@sltc.edu.lk
                  </a>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", backgroundColor: "rgba(255, 255, 255, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255, 255, 255, 0.1)", color: "var(--isaca-green)", flexShrink: 0 }}>
                  <Phone style={{ width: "1.25rem", height: "1.25rem" }} />
                </div>
                <div>
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#ffffff" }}>Contact Center</h4>
                  <span style={{ fontSize: "0.75rem", color: "var(--slate-400)", display: "block", marginTop: "0.25rem", fontFamily: "var(--font-mono)" }}>
                    +94 (0) 11 210 0500 (SLTC Office)
                  </span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: "0.75rem", color: "var(--slate-500)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>
              SLTC ISACA STUDENT CHAPTER
            </div>
          </div>

          {/* Right Side: Interactive Message Form */}
          <div>
            <div className="glass" style={{ borderRadius: "1rem", padding: "2rem", position: "relative", overflow: "hidden" }}>
              {/* Decorative gradient top border */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, var(--isaca-green), var(--isaca-blue))" }}></div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  {/* Full Name */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", position: "relative" }}>
                    <label style={{ fontSize: "0.75rem", color: "var(--slate-400)", fontFamily: "var(--font-mono)" }}>FULL NAME <span style={{ color: "var(--isaca-green)" }}>*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  {/* Email Address */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", position: "relative" }}>
                    <label style={{ fontSize: "0.75rem", color: "var(--slate-400)", fontFamily: "var(--font-mono)" }}>EMAIL ADDRESS <span style={{ color: "var(--isaca-green)" }}>*</span></label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. jdoe@sltc.ac.lk"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Student ID */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", position: "relative" }}>
                  <label style={{ fontSize: "0.75rem", color: "var(--slate-400)", fontFamily: "var(--font-mono)" }}>STUDENT REGISTRATION ID (OPTIONAL)</label>
                  <input
                    type="text"
                    placeholder="e.g. SLTC-BCS-CY-08-012"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="form-input"
                  />
                </div>

                {/* Message */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", position: "relative" }}>
                  <label style={{ fontSize: "0.75rem", color: "var(--slate-400)", fontFamily: "var(--font-mono)" }}>MESSAGE DETAILS <span style={{ color: "var(--isaca-green)" }}>*</span></label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what you want to achieve or any inquiries you have..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-textarea"
                    style={{ resize: "none" }}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{ width: "100%", opacity: isSubmitting ? 0.5 : 1, marginTop: "0.5rem" }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin" style={{ width: "1rem", height: "1rem", border: "2px solid #080b11", borderTopColor: "transparent", borderRadius: "9999px" }}></div>
                      Encrypting & Sending...
                    </>
                  ) : (
                    <>
                      <Send style={{ width: "0.875rem", height: "0.875rem" }} />
                      Transmit Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "1rem", borderRadius: "0.75rem", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>
            {toast.type === "success" ? (
              <CheckCircle style={{ width: "1.25rem", height: "1.25rem", flexShrink: 0, color: "#34d399", marginTop: "2px" }} />
            ) : (
              <AlertCircle style={{ width: "1.25rem", height: "1.25rem", flexShrink: 0, color: "#fb7185", marginTop: "2px" }} />
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <h5 style={{ fontSize: "0.75rem", fontWeight: 700, color: "#ffffff" }}>
                {toast.type === "success" ? "Transmission Complete" : "Error Logged"}
              </h5>
              <p style={{ fontSize: "11px", lineHeight: 1.5 }}>{toast.message}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
