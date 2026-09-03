"use client";

import { Shield, FileCheck, Landmark, AlertTriangle, Fingerprint } from "lucide-react";

export default function About() {
  const pillars = [
    {
      title: "Cyber Security",
      desc: "Deep dive into ethical hacking, threat intelligence, and digital defense strategies to protect complex critical infrastructures.",
      icon: Shield,
      bgGrad: "linear-gradient(to bottom right, #34d399, #14b8a6)",
      glow: "rgba(16, 185, 129, 0.15)",
    },
    {
      title: "Information Systems Audit",
      desc: "Learn to systematically evaluate, verify, and monitor business applications, data processing facilities, and control mechanisms.",
      icon: FileCheck,
      bgGrad: "linear-gradient(to bottom right, #22d3ee, #0ea5e9)",
      glow: "rgba(14, 165, 233, 0.15)",
    },
    {
      title: "IT Governance",
      desc: "Align technology strategy with business goals. Study standard enterprise governance models and frameworks such as COBIT.",
      icon: Landmark,
      bgGrad: "linear-gradient(to bottom right, #818cf8, #3b82f6)",
      glow: "rgba(99, 102, 241, 0.15)",
    },
    {
      title: "Risk Management",
      desc: "Identify, analyze, and mitigate potential disruptions, security loopholes, and financial exposure in enterprise technology ecosystems.",
      icon: AlertTriangle,
      bgGrad: "linear-gradient(to bottom right, #fbbf24, #f97316)",
      glow: "rgba(245, 158, 11, 0.15)",
    },
    {
      title: "Digital Trust",
      desc: "Champion absolute transparency, robust user privacy compliance, and digital integrity as core design ethics in modern applications.",
      icon: Fingerprint,
      bgGrad: "linear-gradient(to bottom right, #c084fc, #d946ef)",
      glow: "rgba(168, 85, 247, 0.15)",
    },
  ];

  return (
    <section id="about" className="section" style={{ overflow: "hidden" }}>
      {/* Background decoration */}
      <div style={{
        position: "absolute",
        right: 0,
        top: "50%",
        width: "20rem",
        height: "20rem",
        borderRadius: "9999px",
        backgroundColor: "rgba(0, 208, 116, 0.05)",
        filter: "blur(100px)",
        zIndex: -10
      }}></div>

      <div className="container">
        {/* Section Header */}
        <div className="about-header">
          <div style={{ maxWidth: "42rem" }}>
            <h2 className="section-subtitle">
              Who We Are
            </h2>
            <h3 className="section-title">
              Bridging Academics <br style={{ display: "block" }} />
              and Cyber Industry Standards
            </h3>
          </div>
          <p className="section-desc" style={{ maxWidth: "28rem" }}>
            The ISACA Student Group at SLTC Research University is a student-led organization affiliated with ISACA International and the local Sri Lanka Chapter. We guide students toward rewarding global careers in IT audit, cyber security, governance, and trust management.
          </p>
        </div>

        {/* Pillars Cards Grid */}
        <div className="pillars-grid">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="glass glass-hover pillar-card"
                style={{
                  boxShadow: `0 4px 24px -6px ${pillar.glow}`,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {/* Icon Wrapper */}
                  <div className="pillar-icon-box" style={{ background: pillar.bgGrad }}>
                    <Icon style={{ width: "1.5rem", height: "1.5rem", color: "#080b11", strokeWidth: 2 }} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#ffffff" }}>
                      {pillar.title}
                    </h4>
                    <p style={{ fontSize: "0.75rem", color: "var(--slate-400)", lineHeight: 1.625 }}>
                      {pillar.desc}
                    </p>
                  </div>
                </div>

                <div style={{
                  paddingTop: "1rem",
                  borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                  marginTop: "1rem",
                  fontSize: "10px",
                  color: "var(--slate-500)",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.05em"
                }}>
                  PILLAR 0{index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
