"use client";

import { useState } from "react";
import { Mail, Award, Globe, X } from "lucide-react";

const LinkedInIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg style={{ width: "1rem", height: "1rem", ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface Member {
  name: string;
  role: string;
  avatarLetter: string;
  bio: string;
  linkedin: string;
  email: string;
  badge?: string;
}

export default function Team() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const team: Member[] = [
    {
      name: "Dr. Nalin Wickramasinghe",
      role: "Faculty Advisor",
      avatarLetter: "NW",
      badge: "Faculty Mentor",
      bio: "Senior Lecturer at the School of Computing, SLTC Research University. Providing strategic guidance, academic alignment, and connecting the student chapter with ISACA Sri Lanka Board of Directors.",
      linkedin: "https://linkedin.com",
      email: "nalinw@sltc.ac.lk",
    },
    {
      name: "Kasun Perera",
      role: "President",
      avatarLetter: "KP",
      badge: "Executive Board",
      bio: "Final year BCS Cybersecurity student. Passionate about offensive security, penetration testing, and organizing tech conferences. Leading the team in establishing industrial connections.",
      linkedin: "https://linkedin.com",
      email: "kasun.p@sltc.ac.lk",
    },
    {
      name: "Achini Silva",
      role: "Vice President",
      avatarLetter: "AS",
      badge: "Executive Board",
      bio: "Specializing in Cloud Computing and Digital Trust models. Co-managing active community partnerships, webinar schedules, and coordinating student workshops at SLTC.",
      linkedin: "https://linkedin.com",
      email: "achini.s@sltc.ac.lk",
    },
    {
      name: "Thilina Bandara",
      role: "Secretary",
      avatarLetter: "TB",
      badge: "Executive Board",
      bio: "Penultimate year Software Engineering student. Leading operations, communication pipelines with members, constitutional governance, and documentation processes.",
      linkedin: "https://linkedin.com",
      email: "thilina.b@sltc.ac.lk",
    },
    {
      name: "Dilum Fernando",
      role: "Treasurer",
      avatarLetter: "DF",
      badge: "Executive Board",
      bio: "Focusing on IT Audit and Risk Management pathways. Managing student group budgets, sponsorship coordinates, and event funding systems.",
      linkedin: "https://linkedin.com",
      email: "dilum.f@sltc.ac.lk",
    },
  ];

  return (
    <section id="team" className="section" style={{ overflow: "hidden" }}>
      <div style={{
        position: "absolute",
        right: 0,
        bottom: "33%",
        width: "20rem",
        height: "20rem",
        borderRadius: "9999px",
        backgroundColor: "rgba(0, 208, 116, 0.05)",
        filter: "blur(100px)",
        zIndex: -10
      }}></div>

      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "42rem", margin: "0 auto 4rem auto" }}>
          <h2 className="section-subtitle">
            Who Leads Us
          </h2>
          <h3 className="section-title" style={{ marginBottom: "1rem" }}>
            Board of Officials
          </h3>
          <p className="section-desc">
            Meet the executive committee and academic mentors steering the SLTC ISACA Student Group.
          </p>
        </div>

        {/* Team Grid */}
        <div className="team-grid">
          {team.map((member) => (
            <div
              key={member.name}
              className="glass glass-hover team-card"
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", width: "100%" }}>
                {/* Avatar representation */}
                <div className="avatar-box">
                  <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--slate-300)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>
                    {member.avatarLetter}
                  </span>
                  {member.role.includes("Advisor") && (
                    <div className="advisor-badge">
                      <Award style={{ width: "0.875rem", height: "0.875rem", color: "#080b11" }} />
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", width: "100%" }}>
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#ffffff", lineHeight: 1.25 }}>
                    {member.name}
                  </h4>
                  <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--slate-400)", fontFamily: "var(--font-mono)" }}>
                    {member.role}
                  </span>
                </div>
              </div>

              <div style={{ width: "100%", paddingTop: "1.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.05)", marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {/* Social icons */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: "0.5rem", borderRadius: "0.5rem", backgroundColor: "rgba(255, 255, 255, 0.05)", color: "var(--slate-400)", cursor: "pointer" }}
                    aria-label="LinkedIn Profile"
                  >
                    <LinkedInIcon />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    style={{ padding: "0.5rem", borderRadius: "0.5rem", backgroundColor: "rgba(255, 255, 255, 0.05)", color: "var(--slate-400)", cursor: "pointer" }}
                    aria-label="Email Member"
                  >
                    <Mail style={{ width: "1rem", height: "1rem" }} />
                  </a>
                </div>

                <button
                  onClick={() => setSelectedMember(member)}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "0.75rem", backgroundColor: "rgba(255, 255, 255, 0.02)", fontSize: "10px", fontWeight: 700, color: "var(--slate-400)", border: "1px solid rgba(255, 255, 255, 0.05)", cursor: "pointer" }}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Bio Modal */}
      {selectedMember && (
        <div className="modal-backdrop">
          <div className="glass animate-float" style={{ width: "100%", maxWidth: "28rem", borderRadius: "1rem", border: "1px solid rgba(255, 255, 255, 0.1)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", position: "relative", overflow: "hidden", padding: "1.5rem" }}>
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              style={{ position: "absolute", top: "1rem", right: "1rem", padding: "0.5rem", color: "var(--slate-400)", background: "transparent", border: "none", cursor: "pointer" }}
            >
              <X style={{ width: "1.25rem", height: "1.25rem" }} />
            </button>

            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ width: "4rem", height: "4rem", borderRadius: "0.75rem", background: "linear-gradient(to top right, var(--isaca-green), var(--isaca-blue))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#080b11", fontFamily: "var(--font-mono)" }}>
                  {selectedMember.avatarLetter}
                </span>
              </div>
              <div>
                <span style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", padding: "0.125rem 0.5rem", borderRadius: "0.25rem", backgroundColor: "rgba(0, 208, 116, 0.1)", color: "var(--isaca-green)", border: "1px solid rgba(0, 208, 116, 0.2)" }}>
                  {selectedMember.badge || "Committee Member"}
                </span>
                <h4 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#ffffff", marginTop: "0.375rem", lineHeight: 1 }}>
                  {selectedMember.name}
                </h4>
                <p style={{ fontSize: "0.75rem", color: "var(--slate-400)", fontFamily: "var(--font-mono)", marginTop: "0.25rem" }}>
                  {selectedMember.role}
                </p>
              </div>
            </div>

            {/* Bio Body */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.875rem", lineHeight: 1.625, color: "var(--slate-300)" }}>
              <p>{selectedMember.bio}</p>
              
              <div style={{ paddingTop: "1rem", borderTop: "1px solid rgba(255, 255, 255, 0.05)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.75rem", color: "var(--slate-400)" }}>
                  <Mail style={{ width: "1rem", height: "1rem", color: "var(--isaca-green)" }} />
                  <a href={`mailto:${selectedMember.email}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {selectedMember.email}
                  </a>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.75rem", color: "var(--slate-400)" }}>
                  <LinkedInIcon style={{ color: "var(--isaca-blue)" }} />
                  <a href={selectedMember.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                    LinkedIn Profile
                  </a>
                </div>
                {selectedMember.role.includes("Advisor") && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.75rem", color: "var(--slate-400)" }}>
                    <Globe style={{ width: "1rem", height: "1rem", color: "var(--sltc-gold)" }} />
                    <span>SLTC School of Computing Faculty</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedMember(null)}
              style={{ marginTop: "1.5rem", width: "100%", padding: "0.625rem", backgroundColor: "rgba(255, 255, 255, 0.05)", fontSize: "0.75rem", fontWeight: 600, color: "var(--slate-300)", borderRadius: "0.75rem", border: "1px solid rgba(255, 255, 255, 0.05)", cursor: "pointer" }}
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
