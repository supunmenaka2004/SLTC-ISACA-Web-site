"use client";

import { useState } from "react";
import { BookOpen, Award, ArrowUpRight, Search, Download } from "lucide-react";

interface Certificate {
  acronym: string;
  fullName: string;
  focus: string;
  audience: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadingCert, setDownloadingCert] = useState<string | null>(null);

  const certifications: Certificate[] = [
    {
      acronym: "CISA",
      fullName: "Certified Information Systems Auditor",
      focus: "Information Systems Audit, Controls Assurance, and Asset Protection.",
      audience: "IT Auditors, Risk Consultants, Compliance Officers, Security Managers.",
      difficulty: "Intermediate",
    },
    {
      acronym: "CISM",
      fullName: "Certified Information Security Manager",
      focus: "Information Security Governance, Program Development, and Incident Response.",
      audience: "Security Managers, System Architects, Compliance Officers, SOC Leads.",
      difficulty: "Advanced",
    },
    {
      acronym: "CRISC",
      fullName: "Certified in Risk and Information Systems Control",
      focus: "Enterprise IT Risk Identification, Assessment, and Response Plans.",
      audience: "Risk Officers, Business Analysts, Threat Profilers, Network Engineers.",
      difficulty: "Advanced",
    },
    {
      acronym: "CSX-P",
      fullName: "Cybersecurity Practitioner Certification",
      focus: "Hands-on Network Protection, Incident Detection, and Threat Mitigation.",
      audience: "SOC Analysts, Penetration Testers, Incident Responders, Engineers.",
      difficulty: "Intermediate",
    },
  ];

  const filteredCerts = certifications.filter(
    (cert) =>
      cert.acronym.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.focus.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (certAcronym: string) => {
    setDownloadingCert(certAcronym);
    setTimeout(() => {
      setDownloadingCert(null);
      alert(`[SLTC ISACA Portal] Downloading official ${certAcronym} Student Study Guide and Roadmap 2026 PDF!`);
    }, 1200);
  };

  return (
    <section id="resources" className="section">
      <div style={{
        position: "absolute",
        top: "25%",
        left: "33%",
        width: "20rem",
        height: "20rem",
        borderRadius: "9999px",
        backgroundColor: "rgba(14, 165, 233, 0.05)",
        filter: "blur(100px)",
        zIndex: -10
      }}></div>

      <div className="container">
        {/* Section Header */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", marginBottom: "4rem", gap: "2rem" }}>
          <div style={{ maxWidth: "36rem" }}>
            <h2 className="section-subtitle">
              Student Hub
            </h2>
            <h3 className="section-title">
              Certification Pathways & Resources
            </h3>
            <p className="section-desc" style={{ marginTop: "1rem" }}>
              Explore globally-recognized ISACA certifications. We offer official curriculum roadmaps, study resources, and peer guidance groups at SLTC.
            </p>
          </div>

          {/* Search bar */}
          <div style={{ position: "relative", width: "100%", maxWidth: "20rem" }}>
            <input
              type="text"
              placeholder="Search pathways (e.g. CISA, Cloud)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "2.5rem" }}
            />
            <Search style={{ position: "absolute", left: "0.875rem", top: "0.875rem", width: "1rem", height: "1rem", color: "var(--slate-400)" }} />
          </div>
        </div>

        {/* Certifications Grid */}
        <div className="certs-grid">
          {filteredCerts.map((cert) => (
            <div
              key={cert.acronym}
              className="glass glass-hover"
              style={{ borderRadius: "1rem", padding: "1.5rem", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            >
              {/* Corner design mark */}
              <div style={{
                position: "absolute",
                top: "-3rem",
                right: "-3rem",
                width: "7rem",
                height: "7rem",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "var(--slate-700)",
                fontWeight: 700,
                transform: "rotate(45deg)",
                userSelect: "none"
              }}>
                ISACA CERT
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", backgroundColor: "rgba(0, 208, 116, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0, 208, 116, 0.2)", flexShrink: 0 }}>
                    <Award style={{ width: "1.5rem", height: "1.5rem", color: "var(--isaca-green)" }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#ffffff", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>
                      {cert.acronym}
                    </h4>
                    <span style={{ fontSize: "10px", color: "var(--slate-400)", fontWeight: 500 }}>
                      {cert.fullName}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.875rem" }}>
                  <div>
                    <div style={{ fontSize: "9px", color: "var(--slate-500)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                      CORE FOCUS AREAS
                    </div>
                    <p style={{ color: "var(--slate-300)", lineHeight: 1.625 }}>{cert.focus}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: "9px", color: "var(--slate-500)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                      TARGET AUDIENCE
                    </div>
                    <p style={{ color: "var(--slate-300)", lineHeight: 1.625 }}>{cert.audience}</p>
                  </div>
                </div>
              </div>

              <div style={{ paddingTop: "1.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.05)", marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                <span className={`diff-badge diff-${cert.difficulty.toLowerCase()}`}>
                  {cert.difficulty} Level
                </span>

                <button
                  onClick={() => handleDownload(cert.acronym)}
                  disabled={downloadingCert !== null}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--isaca-green)", background: "none", border: "none", cursor: "pointer", opacity: downloadingCert !== null ? 0.5 : 1 }}
                >
                  {downloadingCert === cert.acronym ? (
                    <>
                      <div className="animate-spin" style={{ width: "0.875rem", height: "0.875rem", border: "2px solid var(--isaca-green)", borderTopColor: "transparent", borderRadius: "9999px" }}></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download style={{ width: "0.875rem", height: "0.875rem", flexShrink: 0 }} />
                      Get Study Roadmap
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Global Resource links */}
        <div className="glass" style={{ padding: "1.5rem", borderRadius: "1rem", border: "1px solid rgba(255, 255, 255, 0.05)", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", backgroundColor: "rgba(255, 255, 255, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255, 255, 255, 0.1)", color: "var(--slate-300)", flexShrink: 0 }}>
              <BookOpen style={{ width: "1.25rem", height: "1.25rem" }} />
            </div>
            <div>
              <h5 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#ffffff" }}>Looking for academic resource downloads?</h5>
              <p style={{ fontSize: "0.75rem", color: "var(--slate-400)", marginTop: "2px" }}>Access syllabus documents, templates, and exam practice papers.</p>
            </div>
          </div>
          <a
            href="https://www.isaca.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.25rem", fontSize: "0.75rem", fontWeight: 600, color: "#080b11", backgroundColor: "#ffffff", borderRadius: "0.5rem", textDecoration: "none", flexShrink: 0 }}
          >
            Go to ISACA International
            <ArrowUpRight style={{ width: "0.875rem", height: "0.875rem" }} />
          </a>
        </div>
      </div>
    </section>
  );
}
