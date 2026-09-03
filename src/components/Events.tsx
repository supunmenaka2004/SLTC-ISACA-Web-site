"use client";

import { useState } from "react";
import { Calendar, MapPin, Clock, ArrowRight, ShieldCheck, X } from "lucide-react";

interface Event {
  id: string;
  title: string;
  category: "workshops" | "summits" | "webinars";
  date: string;
  time: string;
  location: string;
  status: "upcoming" | "past";
  desc: string;
  image: string;
}

export default function Events() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [regForm, setRegForm] = useState({ name: "", email: "", batch: "" });

  const events: Event[] = [
    {
      id: "ev-1",
      title: "Cyber Shield 2026: Cyber Summit & CTF",
      category: "summits",
      date: "Oct 14, 2026",
      time: "09:00 AM - 04:30 PM",
      location: "SLTC Main Auditorium / Hybrid",
      status: "upcoming",
      desc: "The flagship annual cyber conference and Capture-The-Flag (CTF) competition of SLTC ISACA Student Group. Engage with top-tier cybersecurity leaders, learn about emerging digital trust paradigms, and participate in jeopardy-style security challenges to win cash prizes.",
      image: "/cyber_summit.jpg",
    },
    {
      id: "ev-2",
      title: "Ethical Hacking 101: Linux & Metasploit Labs",
      category: "workshops",
      date: "Aug 28, 2026",
      time: "02:00 PM - 05:00 PM",
      location: "Academic Block IT Lab 03, SLTC",
      status: "upcoming",
      desc: "An intensive, hands-on workshop focused on local system penetration testing. Learn Linux security foundations, command-line vulnerability assessments, and standard exploitation methodologies using the Metasploit framework in a safe sandbox.",
      image: "/hacking_workshop.jpg",
    },
    {
      id: "ev-3",
      title: "IT Audit & Compliance: Industry Frameworks",
      category: "webinars",
      date: "Sep 05, 2026",
      time: "07:00 PM - 08:30 PM",
      location: "Zoom Virtual Platform",
      status: "upcoming",
      desc: "Discover what it takes to audit large scale IT infrastructure. This webinar introduces essential concepts in governance, assessing management controls, auditing cloud clusters, and mapping them to global compliance standards like COBIT 2019.",
      image: "/it_audit.jpg",
    },
    {
      id: "ev-4",
      title: "Cloud Infrastructure Security Architectures",
      category: "webinars",
      date: "Jun 15, 2026",
      time: "06:30 PM - 08:00 PM",
      location: "Zoom / Recorded Session",
      status: "past",
      desc: "Expert-led session explaining cloud design patterns, identity governance, access restrictions, IAM role configurations, and automatic security audits on AWS and Google Cloud Platform (GCP).",
      image: "/it_audit.jpg",
    },
    {
      id: "ev-5",
      title: "OWASP Top 10: Web Application Assessments",
      category: "workshops",
      date: "May 12, 2026",
      time: "01:00 PM - 04:00 PM",
      location: "Hybrid / SLTC Campus IT Hub",
      status: "past",
      desc: "Detailed hands-on workshop highlighting critical vulnerabilities in web applications. Focused on debugging and demonstrating SQL Injections, Cross-Site Scripting (XSS), and Cross-Site Request Forgery (CSRF).",
      image: "/hacking_workshop.jpg",
    },
  ];

  const categories = [
    { name: "All Events", value: "all" },
    { name: "Workshops", value: "workshops" },
    { name: "Cyber Summits", value: "summits" },
    { name: "Webinars", value: "webinars" },
  ];

  const filteredEvents = activeCategory === "all"
    ? events
    : events.filter(e => e.category === activeCategory);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regForm.name && regForm.email) {
      setIsRegistered(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsRegistered(false);
    setRegForm({ name: "", email: "", batch: "" });
  };

  return (
    <section id="events" className="section">
      <div style={{
        position: "absolute",
        top: "33%",
        left: 0,
        width: "20rem",
        height: "20rem",
        borderRadius: "9999px",
        backgroundColor: "rgba(14, 165, 233, 0.05)",
        filter: "blur(100px)",
        zIndex: -10
      }}></div>

      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "42rem", margin: "0 auto 4rem auto" }}>
          <h2 className="section-subtitle">
            Our Activities
          </h2>
          <h3 className="section-title" style={{ marginBottom: "1rem" }}>
            Interactive Learning Events
          </h3>
          <p className="section-desc">
            Expand your skills through active workshops, annual tech summits, and certification webinars hosted by industry experts.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`category-tab ${activeCategory === cat.value ? "active" : ""}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="events-grid">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className="glass glass-hover event-card"
            >
              {/* Cover Image */}
              <div style={{ position: "relative", width: "100%", height: "11rem", overflow: "hidden", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", backgroundColor: "#020617" }}>
                <img
                  src={event.image}
                  alt={event.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12, 18, 30, 0.8), transparent)" }}></div>
              </div>

              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", flexGrow: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {/* Event Card Header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                    <span className={`event-badge badge-${event.category}`}>
                      {event.category}
                    </span>

                    <span className={`status-badge status-${event.status} ${event.status === "upcoming" ? "animate-pulse" : ""}`}>
                      {event.status}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <h4 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#ffffff", lineHeight: 1.375 }}>
                      {event.title}
                    </h4>
                    <p style={{ fontSize: "0.75rem", color: "var(--slate-400)", lineHeight: 1.625 }}>
                      {event.desc}
                    </p>
                  </div>
                </div>

                {/* Event Meta Info */}
                <div style={{ paddingTop: "1.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.05)", marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--slate-400)" }}>
                    <Calendar style={{ width: "0.875rem", height: "0.875rem", color: "var(--isaca-green)", flexShrink: 0 }} />
                    <span>{event.date}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--slate-400)" }}>
                    <Clock style={{ width: "0.875rem", height: "0.875rem", color: "var(--isaca-green)", flexShrink: 0 }} />
                    <span>{event.time}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--slate-400)" }}>
                    <MapPin style={{ width: "0.875rem", height: "0.875rem", color: "var(--isaca-green)", flexShrink: 0 }} />
                    <span>{event.location}</span>
                  </div>

                  <button
                    onClick={() => setSelectedEvent(event)}
                    style={{
                      marginTop: "1rem",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      width: "100%",
                      padding: "0.625rem",
                      borderRadius: "0.75rem",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--slate-300)",
                      cursor: "pointer"
                    }}
                  >
                    {event.status === "upcoming" ? "Register Now" : "View Overview"}
                    <ArrowRight style={{ width: "0.875rem", height: "0.875rem" }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Popup */}
      {selectedEvent && (
        <div className="modal-backdrop">
          <div className="glass modal-card animate-float">
            {/* Modal close */}
            <button
              onClick={handleCloseModal}
              style={{ position: "absolute", top: "1rem", right: "1rem", padding: "0.5rem", color: "var(--slate-400)", background: "transparent", border: "none", cursor: "pointer" }}
            >
              <X style={{ width: "1.25rem", height: "1.25rem" }} />
            </button>

            {/* Modal Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <span className={`event-badge badge-${selectedEvent.category}`}>
                  {selectedEvent.category}
                </span>
                <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#ffffff", marginTop: "0.75rem", lineHeight: 1.375 }}>
                  {selectedEvent.title}
                </h4>
              </div>

              <p style={{ fontSize: "0.875rem", color: "var(--slate-400)", lineHeight: 1.625 }}>
                {selectedEvent.desc}
              </p>

              {/* Event details block */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", padding: "1rem", borderRadius: "0.75rem", backgroundColor: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.75rem", color: "var(--slate-300)" }}>
                  <Calendar style={{ width: "1rem", height: "1rem", color: "var(--isaca-green)", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--slate-500)", fontFamily: "var(--font-mono)" }}>DATE</div>
                    <div>{selectedEvent.date}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.75rem", color: "var(--slate-300)" }}>
                  <Clock style={{ width: "1rem", height: "1rem", color: "var(--isaca-green)", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--slate-500)", fontFamily: "var(--font-mono)" }}>TIME</div>
                    <div>{selectedEvent.time}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.75rem", color: "var(--slate-300)", gridColumn: "span 2" }}>
                  <MapPin style={{ width: "1rem", height: "1rem", color: "var(--isaca-green)", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--slate-500)", fontFamily: "var(--font-mono)" }}>LOCATION</div>
                    <div>{selectedEvent.location}</div>
                  </div>
                </div>
              </div>

              {/* Registration Form / Status */}
              {selectedEvent.status === "upcoming" ? (
                <div>
                  {!isRegistered ? (
                    <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <h5 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#ffffff", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "0.5rem" }}>
                        Reserve Your Seat
                      </h5>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                          <label style={{ fontSize: "10px", color: "var(--slate-400)", fontFamily: "var(--font-mono)" }}>FULL NAME</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. John Doe"
                            value={regForm.name}
                            onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                            className="form-input"
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                          <label style={{ fontSize: "10px", color: "var(--slate-400)", fontFamily: "var(--font-mono)" }}>EMAIL ADDRESS</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. name@sltc.ac.lk"
                            value={regForm.email}
                            onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                            className="form-input"
                          />
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                        <label style={{ fontSize: "10px", color: "var(--slate-400)", fontFamily: "var(--font-mono)" }}>ACADEMIC BATCH / SPECIALIZATION (OPTIONAL)</label>
                        <input
                          type="text"
                          placeholder="e.g. BCS Cybersecurity Batch 08"
                          value={regForm.batch}
                          onChange={e => setRegForm({ ...regForm, batch: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn-primary"
                        style={{ marginTop: "0.5rem", width: "100%" }}
                      >
                        Register for Event
                      </button>
                    </form>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem", textAlign: "center", gap: "0.75rem", backgroundColor: "rgba(0, 208, 116, 0.05)", border: "1px solid rgba(0, 208, 116, 0.2)", borderRadius: "0.75rem" }}>
                      <div style={{ width: "3rem", height: "3rem", borderRadius: "9999px", backgroundColor: "rgba(0, 208, 116, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0, 208, 116, 0.2)" }}>
                        <ShieldCheck style={{ width: "1.5rem", height: "1.5rem", color: "var(--isaca-green)" }} />
                      </div>
                      <h5 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#ffffff" }}>Registration Successful!</h5>
                      <p style={{ fontSize: "0.75rem", color: "var(--slate-400)", maxWidth: "24rem" }}>
                        Thank you, <span style={{ color: "#ffffff", fontWeight: 500 }}>{regForm.name}</span>. A confirmation token and session calendar invite have been dispatched to <span style={{ color: "#ffffff", fontWeight: 500 }}>{regForm.email}</span>.
                      </p>
                      <button
                        onClick={handleCloseModal}
                        style={{ marginTop: "0.5rem", padding: "0.5rem 1.5rem", backgroundColor: "rgba(255, 255, 255, 0.05)", fontSize: "10px", fontWeight: 600, color: "var(--slate-300)", borderRadius: "0.5rem", border: "1px solid rgba(255, 255, 255, 0.05)", cursor: "pointer" }}
                      >
                        Close Portal
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingTop: "0.5rem", textAlign: "center" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--slate-500)", fontFamily: "var(--font-mono)", fontStyle: "italic" }}>
                    This is a completed event. Slide logs and video playback recording link are available on our private Teams community.
                  </div>
                  <button
                    onClick={handleCloseModal}
                    style={{ marginTop: "1rem", padding: "0.625rem", backgroundColor: "rgba(255, 255, 255, 0.05)", fontSize: "0.75rem", fontWeight: 600, color: "var(--slate-300)", borderRadius: "0.75rem", border: "1px solid rgba(255, 255, 255, 0.05)", cursor: "pointer" }}
                  >
                    Go Back
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
