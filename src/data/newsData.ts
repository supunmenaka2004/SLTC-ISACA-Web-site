export const newsCategories = [
  "Cybersecurity",
  "Cyber Attacks",
  "Data Breaches",
  "AI Security",
  "Malware & Ransomware",
  "Vulnerabilities & CVEs",
  "Cloud Security",
  "Digital Privacy",
  "Network Security",
  "Research",
  "Threat Intelligence",
  "High Profile Threats",
  "Threat Research",
  "Vulnerability Intelligence",
] as const;

export type NewsCategory = (typeof newsCategories)[number];

export interface NewsArticleSection {
  heading: string;
  paragraphs: string[];
  points?: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  category: NewsCategory;
  publishedDate: string;
  publishedAt: string;
  excerpt: string; // Level 1: 1-2 lines concise summary for homepage / listing cards
  content: string[];
  sections?: NewsArticleSection[];
  keyHighlights?: string[];
  technicalInformation?: string[]; // Level 2: Technical analysis & attack vectors
  affectedSystems?: string[]; // Level 2: Affected products, protocols, or infrastructure
  securityRecommendations?: string[]; // Level 2: Defensive mitigation steps
  image: string;
  imageAlt: string;
  publisher: string;
  author?: string;
  sourceUrl?: string;
  sourceName?: string;
  featured?: boolean;
  trending?: boolean;
}

export function getReadingTimeMinutes(article: NewsItem) {
  const sectionText =
    article.sections
      ?.flatMap((section) => [
        section.heading,
        ...section.paragraphs,
        ...(section.points ?? []),
      ])
      .join(" ") ?? "";
  const extraText = [
    ...(article.technicalInformation ?? []),
    ...(article.affectedSystems ?? []),
    ...(article.securityRecommendations ?? []),
    ...(article.keyHighlights ?? []),
  ].join(" ");

  const words = `${article.title} ${article.excerpt} ${article.content.join(" ")} ${sectionText} ${extraText}`
    .trim()
    .split(/\s+/).length;

  return Math.max(1, Math.ceil(words / 220));
}

export const newsData: NewsItem[] = [
  {
    id: "news-5",
    title: "Cyber chief: UK facing AI-powered attacks on critical infrastructure within two years",
    category: "AI Security",
    publishedDate: "November 03, 2026",
    publishedAt: "2026-11-03T00:00:00.000Z",
    excerpt: "The UK National Cyber Security Centre warns that AI could accelerate ransomware and exploit automation against essential utilities by 2028.",
    content: [],
    keyHighlights: [
      "The NCSC projects AI will dramatically scale threat actors' efficiency in vulnerability reconnaissance and weaponization.",
      "National critical infrastructure operators are advised to prepare defenses against autonomous ransomware variants before 2028.",
      "Emphasizes foundational cyber hygiene over specialized tooling as the single most effective barrier against AI threat vectors.",
    ],
    sections: [
      {
        heading: "Strategic Forecast and Emergent Threat Vectors",
        paragraphs: [
          "In its annual State of the Cyber Nation assessment, the UK National Cyber Security Centre (NCSC) highlighted the rapid convergence of large language models and autonomous exploitation toolkits. The intelligence forecast warns that hostile state-sponsored groups and syndicated ransomware cartels will likely integrate machine-learning pipelines into existing command-and-control operations within twenty-four months.",
          "Rather than inventing novel attack surfaces, artificial intelligence accelerates traditional kill chains. Reconnaissance cycles that previously required weeks of manual network surveying can now execute in minutes, enabling threat actors to identify zero-day exposures and unpatched edge infrastructure at machine speed.",
        ],
      },
      {
        heading: "Resilience Priorities for Critical Infrastructure",
        paragraphs: [
          "The advisory specifically addresses operators of power grids, water treatment facilities, telecommunications backbones, and healthcare logistics. Analysts stress that attackers frequently leverage legacy operational technology (OT) bridged inadvertently to corporate IT networks.",
          "Defenders are strongly urged to close persistent architectural gaps, enforce rigorous segmentation between administrative environments and industrial telemetry, and implement multi-factor authentication across every remote maintenance portal.",
        ],
      },
    ],
    technicalInformation: [
      "Automated payload polymorphism: Machine learning algorithms dynamically obfuscate malicious binaries to evade heuristic endpoint detection.",
      "High-velocity credential stuffing: Neural networks generate highly context-aware social engineering scripts calibrated to specific departmental roles.",
      "Vulnerability synthesis: Automated scripts ingest CVE disclosures to synthesize working proof-of-concept exploits within hours of public release.",
    ],
    affectedSystems: [
      "SCADA & Operational Technology (OT) edge gateways",
      "Enterprise Identity Providers (Active Directory, Azure AD/Entra ID)",
      "Unpatched edge firewalls and SSL VPN terminators",
      "Public cloud orchestration endpoints (Kubernetes API clusters)",
    ],
    securityRecommendations: [
      "Establish strict air-gapping or micro-segmentation between corporate IT networks and industrial control operations.",
      "Mandate phishing-resistant FIDO2 hardware tokens across all external management interfaces.",
      "Deploy behavioral anomaly detection to identify automated lateral movement across internal subnets.",
      "Maintain validated, offline, immutable system backups tested against full-scale ransomware restoration drills.",
    ],
    image: "/it_audit.jpg",
    imageAlt: "Cybersecurity engineer monitoring threat intelligence dashboards",
    publisher: "UK National Cyber Security Centre",
    author: "NCSC Intelligence Desk",
    sourceName: "National Cyber Security Centre (NCSC)",
    sourceUrl: "https://www.ncsc.gov.uk/news/cyber-chief-uk-facing-ai-powered-attacks-on-critical-infrastructure-in-two-years",
    featured: true,
    trending: true,
  },
  {
    id: "news-6",
    title: "Cyber attack on Publica software supplier: data leak confirmed",
    category: "Data Breaches",
    publishedDate: "October 08, 2026",
    publishedAt: "2026-10-08T00:00:00.000Z",
    excerpt: "Swiss authorities confirm an ongoing investigation into a third-party software provider breach impacting records held by the Federal Pension Fund.",
    content: [],
    keyHighlights: [
      "A supply-chain compromise at a key IT vendor resulted in unauthorized exfiltration of sensitive municipal and pension records.",
      "The Swiss Office of the Attorney General opened a federal criminal proceeding into data theft and digital sabotage.",
      "The incident underscores escalating risks stemming from vendor software integrations and shared API ecosystems.",
    ],
    sections: [
      {
        heading: "Supply-Chain Compromise and Incident Timeline",
        paragraphs: [
          "The Swiss Federal Department of Foreign Affairs (FDFA) confirmed that an external software development partner utilized by the Swiss Federal Pension Fund Publica fell victim to a sophisticated intrusion. Threat actors compromised service account credentials at the provider, obtaining lateral access to client data repositories.",
          "Upon discovering anomalous outbound telemetry at the end of September 2026, the vendor engaged external digital forensics specialists, isolated affected database instances, and notified federal supervisory authorities alongside impacted institutional clients.",
        ],
      },
      {
        heading: "Ongoing Investigation and Impact Mitigation",
        paragraphs: [
          "Federal prosecutors have launched an expansive inquiry in coordination with the Federal Office of Police (fedpol). Investigators are currently reconstructing forensic logs to ascertain the exact volume and sensitivity of member records exfiltrated during the intrusion window.",
          "Publica has initiated direct communication protocols to notify affected beneficiaries, while mandating comprehensive cryptographic rotation across all external API tokens and service interfaces linked to third-party providers.",
        ],
      },
    ],
    technicalInformation: [
      "Compromised OAuth service principal tokens permitted unauthorized cross-tenant data queries.",
      "Encrypted egress channels masqueraded as normal TLS 1.3 telemetry to bypass standard perimeter filters.",
      "Database schema dump commands executed under hijacked administrative service identities.",
    ],
    affectedSystems: [
      "Third-party SaaS administration portals and database replicas",
      "Publica pension account records management systems",
      "Enterprise REST API integration endpoints and OAuth authorization scopes",
    ],
    securityRecommendations: [
      "Perform continuous security audits and least-privilege scoping on third-party service provider access.",
      "Enforce token expiration limits and IP-binding on all service-to-service API connections.",
      "Implement automated database activity monitoring (DAM) alerting on abnormal bulk query volumes.",
      "Establish vendor incident response SLAs requiring notification within 24 hours of suspected compromise.",
    ],
    image: "/hacking_workshop.jpg",
    imageAlt: "Forensics investigators analyzing server logs and breach indicators",
    publisher: "Swiss Federal Department of Foreign Affairs",
    author: "Federal Forensics Unit",
    sourceName: "Federal Department of Foreign Affairs (FDFA)",
    sourceUrl: "https://www.fdfa.admin.ch/en/newnsb/FjG4XOIms04s",
    trending: true,
  },
  {
    id: "news-7",
    title: "Cybercrime: Computer network used by ransomware group dismantled in coordinated international operation",
    category: "Malware & Ransomware",
    publishedDate: "October 01, 2026",
    publishedAt: "2026-10-01T00:00:00.000Z",
    excerpt: "Federal police and international partners successfully seize command infrastructure and decrypt keys belonging to the KillSec ransomware syndicate.",
    content: [],
    keyHighlights: [
      "A cross-border law enforcement initiative dismantled servers and data repositories powering the KillSec extortion operation.",
      "Swiss fedpol and the Office of the Attorney General seized key command nodes and secured private decryption keys.",
      "The disruption halts active affiliate campaigns targeting manufacturing and municipal healthcare infrastructure.",
    ],
    sections: [
      {
        heading: "Coordinated Law Enforcement Strike",
        paragraphs: [
          "In a multi-jurisdictional takedown dubbed Operation Iron Gate, Switzerland's Federal Office of Police (fedpol) partnered with European judicial authorities to neutralize the technical backbone of the KillSec ransomware syndicate. Over thirty virtual private servers distributed across multiple hosting jurisdictions were taken down concurrently.",
          "KillSec, which operated under a Ransomware-as-a-Service (RaaS) model, had extorted millions from European mid-market enterprises since late 2023. The group specialized in double-extortion tactics, pairing cryptographic file locking with threats of public data leak disclosures.",
        ],
      },
      {
        heading: "Key Recovery and Ongoing Proceedings",
        paragraphs: [
          "A major victory of the operation was the acquisition of server images containing cryptographic seed pairs. Forensic specialists are actively extracting decryption keys to assist victims in restoring scrambled data without paying criminal ransoms.",
          "While this server disruption severely cripples KillSec's operational readiness, law enforcement cautions that decentralized affiliate operators often regroup under newly branded banners, necessitating ongoing defensive vigilance.",
        ],
      },
    ],
    technicalInformation: [
      "Custom Rust-based ransomware payloads utilizing ChaCha20-Poly1305 symmetric stream encryption.",
      "Decentralized command-and-control (C2) servers hosted across bulletproof service providers using Fast Flux DNS routing.",
      "Exfiltration pipelines utilizing modified Rclone binaries disguised as standard backup tasks.",
    ],
    affectedSystems: [
      "Windows Domain Controllers and Active Directory forest trusts",
      "VMware ESXi and Hyper-V hypervisors hosting mission-critical workloads",
      "Network Attached Storage (NAS) appliances exposed via unauthenticated SMB ports",
    ],
    securityRecommendations: [
      "Block unauthenticated SMB (Port 445) and RDP (Port 3389) traffic directly at all perimeter firewalls.",
      "Harden virtualization hosts (ESXi/Hyper-V) with restricted management interfaces and dedicated out-of-band VLANs.",
      "Deploy Endpoint Detection and Response (EDR) solutions configured in active blocking mode against known Rust/Go cryptors.",
      "Maintain multi-region air-gapped backup snapshots with immutable write-once-read-many (WORM) locks.",
    ],
    image: "/cyber_summit.jpg",
    imageAlt: "Law enforcement operations center monitoring threat syndicate infrastructure",
    publisher: "Swiss Federal Office of Police",
    author: "Special Investigations Taskforce",
    sourceName: "Federal Office of Police (fedpol)",
    sourceUrl: "https://www.fedpol.admin.ch/en/newnsb/cBOoSTI5a7sc",
    trending: true,
  },
  {
    id: "news-1",
    title: "ISACA Research Team Highlights Emerging Cloud Misconfiguration and IAM Vulnerability Trends",
    category: "Research",
    publishedDate: "September 02, 2026",
    publishedAt: "2026-09-02T00:00:00.000Z",
    excerpt: "Research by the ISACA Student Chapter reveals common multi-cloud permission flaws that expose academic and enterprise systems to privilege escalation.",
    content: [],
    keyHighlights: [
      "Over 65% of audited cloud environments contained over-permissive IAM wildcard policies permitting lateral privilege escalation.",
      "Publicly accessible storage buckets and lingering service account keys remain the top root causes for cloud data exposure.",
      "Provides actionable architectural hardening guidelines tailored for university computing clusters and modern DevOps pipelines.",
    ],
    sections: [
      {
        heading: "Empirical Cloud Security Audit Findings",
        paragraphs: [
          "The ISACA Student Research Unit, in partnership with faculty advisors from the School of Computing, concluded a six-month telemetry review evaluating cloud security posture across simulated academic infrastructure and enterprise staging environments.",
          "The study uncovered widespread reliance on default configuration profiles. Administrators frequently grant broad wildcard permissions (such as `iam:*` or `s3:*`) to accelerate CI/CD deployments, which attackers routinely exploit during initial foothold compromises.",
        ],
      },
      {
        heading: "Automated Detection and Principle of Least Privilege",
        paragraphs: [
          "The research paper introduces an automated auditing framework that benchmarks cloud tenancy policies against CIS Benchmarks and ISO 27001 standards. The tool identifies unrotated access keys older than 90 days and flags inactive roles with administrative scopes.",
          "By implementing continuous policy validation in pre-deployment pipelines, security administrators can detect and eliminate privilege escalation pathways before infrastructure code merges to production.",
        ],
      },
    ],
    technicalInformation: [
      "Instance Metadata Service v1 (IMDSv1) SSRF vectors enabling EC2 IAM role credential extraction.",
      "Excessive `AssumeRole` and `PassRole` permissions enabling privilege escalation to full Cloud Administrator.",
      "Hardcoded long-lived API keys embedded within client-side container environment files.",
    ],
    affectedSystems: [
      "AWS IAM Policies and S3 Object Storage ACLs",
      "Microsoft Azure Role-Based Access Control (RBAC) scopes",
      "Google Cloud Platform (GCP) Service Accounts and Workload Identity pools",
      "Kubernetes cluster role bindings and service account tokens",
    ],
    securityRecommendations: [
      "Enforce IMDSv2 globally across all cloud virtual machines to mitigate server-side request forgery (SSRF).",
      "Replace static long-lived credentials with temporary, short-lived tokens via OpenID Connect (OIDC).",
      "Automate periodic permission boundary audits using Cloud Infrastructure Entitlement Management (CIEM) tools.",
      "Implement strict preventative guardrails using AWS Service Control Policies (SCPs) or Azure Management Policies.",
    ],
    image: "/cyber_hero.jpg",
    imageAlt: "Cloud architecture security diagram and identity telemetry visualization",
    publisher: "SLTC ISACA Student Group Research Unit",
    author: "ISACA Research Team",
    trending: false,
  },
  {
    id: "news-2",
    title: "Understanding the Impact of Generative AI on Modern Cybersecurity Defense Strategies",
    category: "AI Security",
    publishedDate: "August 28, 2026",
    publishedAt: "2026-08-28T00:00:00.000Z",
    excerpt: "An analysis of how SOC teams deploy specialized machine learning models to detect automated adversary phishing and rapid payload mutation.",
    content: [],
    keyHighlights: [
      "Adversaries utilize generative AI models to construct hyper-personalized spear-phishing campaigns lacking conventional grammatical tells.",
      "Defenders are responding with semantic analysis engines capable of parsing intent and detecting synthetic linguistic indicators.",
      "Explores defensive LLMs assisting Tier-1 SOC analysts in correlating multi-source alert telemetry in real time.",
    ],
    sections: [
      {
        heading: "The Evolving Asymmetry of AI in Cyber Offense",
        paragraphs: [
          "The proliferation of uncensored open-weight LLMs has significantly lowered technical barriers for cybercriminals. Attackers can now generate multilingual spear-phishing lures personalized using publicly scraped corporate executive data, achieving unprecedented click-through rates.",
          "Furthermore, autonomous scripting agents are increasingly deployed to automate basic vulnerability scanning, reconnaissance indexing, and payload re-compilation to bypass static hash-based security filters.",
        ],
      },
      {
        heading: "Defensive Adaptation: Autonomous SecOps and Threat Modeling",
        paragraphs: [
          "To counter automated adversary campaigns, defensive architectures are transitioning toward behavioral telemetry processing. Specialized defensive models ingest millions of authentication logs, API call patterns, and network flows to identify subtle anomalies.",
          "Security Operations Centers (SOCs) employing AI co-pilots report a 40% reduction in mean time to detect (MTTD), allowing human analysts to concentrate on complex threat hunting and containment decisions.",
        ],
      },
    ],
    technicalInformation: [
      "Direct and indirect prompt injection attacks against corporate retrieval-augmented generation (RAG) pipelines.",
      "Synthetic spear-phishing vectors evading conventional Bayesian email spam heuristics.",
      "Automated payload polymorphism utilizing LLM-assisted code refactoring to bypass signature-based AV.",
    ],
    affectedSystems: [
      "Secure Email Gateways (SEG) and corporate spam filtering systems",
      "Corporate LLM integrations and enterprise chatbot endpoints",
      "Security Information and Event Management (SIEM) ingest pipelines",
    ],
    securityRecommendations: [
      "Implement natural language processing (NLP) filters trained on synthetic writing detection within inbound mail servers.",
      "Sanitize and validate all external prompt inputs fed into enterprise LLM and internal AI agents.",
      "Conduct regular tabletop simulation exercises focused on AI-augmented identity theft and deepfake voice fraud.",
      "Deploy context-aware zero-trust authentication challenges when high-risk actions are initiated via communication channels.",
    ],
    image: "/it_audit.jpg",
    imageAlt: "Neural network visualization displaying cyber defensive intelligence nodes",
    publisher: "SLTC ISACA Student Group",
    author: "Cybersecurity Editorial Board",
    trending: false,
  },
  {
    id: "news-3",
    title: "Best Practices for Securing Personal Data in an Interconnected Campus Ecosystem",
    category: "Digital Privacy",
    publishedDate: "August 18, 2026",
    publishedAt: "2026-08-18T00:00:00.000Z",
    excerpt: "Practical guidance for students and researchers on multi-factor authentication, device encryption, and safe remote connection standards.",
    content: [],
    keyHighlights: [
      "University networks present unique threat surfaces due to thousands of unmanaged BYOD endpoints connecting daily.",
      "Phishing remains the predominant initial entry vector targeting student university portal credentials.",
      "Provides straightforward steps for full-disk encryption, password vault adoption, and privacy protection on campus Wi-Fi.",
    ],
    sections: [
      {
        heading: "The Complexities of Higher Education Cyber Environments",
        paragraphs: [
          "Colleges and universities balance the dual imperatives of open academic research collaboration and rigorous information security. With students, faculty, and visiting scholars connecting personal laptops, tablets, and smartphones, institutional perimeter defenses face distinct hurdles.",
          "Adversaries frequently target campus networks to harvest intellectual property, access proprietary academic databases, or use compromised student accounts as stepping stones for wider attacks.",
        ],
      },
      {
        heading: "Essential Personal Hygiene for Students and Researchers",
        paragraphs: [
          "Securing student identities starts with moving away from SMS-based two-factor authentication in favor of hardware security keys or authenticator apps. In addition, activating BitLocker or FileVault full-disk encryption ensures that lost or stolen laptops do not lead to data compromises.",
          "When utilizing campus Wi-Fi, students should verify network SSIDs and employ encrypted DNS to protect browsing habits from eavesdropping on open shared subnets.",
        ],
      },
    ],
    technicalInformation: [
      "Rogue access point (Evil Twin) attacks impersonating university eduroam and guest Wi-Fi networks.",
      "Credential harvesting portals mimicking single sign-on (SSO) login screens.",
      "Cleartext credential sniffing across unsegmented laboratory subnets.",
    ],
    affectedSystems: [
      "Student Information Systems (SIS) and University Portal logins",
      "Learning Management Systems (Canvas, Moodle, Blackboard)",
      "Unencrypted personal laptops, USB flash drives, and portable storage devices",
    ],
    securityRecommendations: [
      "Adopt hardware security tokens (FIDO2/WebAuthn) or time-based authenticator apps for all university accounts.",
      "Enable hardware-backed full-disk encryption (BitLocker on Windows, FileVault on macOS) on all mobile devices.",
      "Use university-approved VPN services when transmitting academic research files across external or public networks.",
      "Utilize an enterprise-grade password manager to maintain unique, complex credentials for every service.",
    ],
    image: "/hacking_workshop.jpg",
    imageAlt: "Students collaborating on laptop privacy configurations in university lab",
    publisher: "SLTC ISACA Student Group",
    author: "Student Privacy Taskforce",
    trending: false,
  },
  {
    id: "news-4",
    title: "Modern Approaches to Securing Campus Networks: Implementing Zero-Trust Architectures",
    category: "Network Security",
    publishedDate: "August 12, 2026",
    publishedAt: "2026-08-12T00:00:00.000Z",
    excerpt: "Exploring zero-trust principles, micro-segmentation, and automated perimeter threat mitigation in high-density academic network infrastructure.",
    content: [],
    keyHighlights: [
      "Traditional castle-and-moat perimeter models fail to protect complex modern academic environments.",
      "Zero-Trust Architecture (ZTA) mandates continuous verification of every user, device, and network transaction.",
      "Micro-segmentation effectively isolates student dorm networks, faculty research, and financial administrative servers.",
    ],
    sections: [
      {
        heading: "Deconstructing Legacy Campus Perimeter Defenses",
        paragraphs: [
          "Historically, universities relied on strong perimeter firewalls with wide-open internal subnets. Once a user connected through VPN or on-campus Ethernet, implicit trust was granted across the local area network. This architecture allows a single malware infection on a student device to propagate laterally toward administrative domains.",
          "Under Zero Trust, the network operates on the assumption of breach. Implicit trust is eliminated; every access request must be explicitly authenticated, authorized, and cryptographically verified regardless of physical location.",
        ],
      },
      {
        heading: "Micro-Segmentation and Continuous Policy Enforcement",
        paragraphs: [
          "Implementing software-defined micro-segmentation divides campus infrastructure into logical security zones. Strict access control lists (ACLs) prevent traffic from student dormitory VLANs from directly routing to sensitive research databases or university payroll servers.",
          "Next-generation firewalls equipped with deep packet inspection (DPI) continuously inspect east-west internal traffic, detecting and isolating unauthorized scanning activities before threat actors achieve persistence.",
        ],
      },
    ],
    technicalInformation: [
      "802.1X Network Access Control (NAC) enforcing device health compliance checks prior to subnet admission.",
      "Software-Defined Perimeter (SDP) architecture replacing legacy full-tunnel SSL VPNs.",
      "Real-time TLS 1.3 encrypted traffic analysis utilizing machine-learning packet metadata classification.",
    ],
    affectedSystems: [
      "Campus Core Layer-3 Routing Switches and VLAN boundaries",
      "Enterprise Wi-Fi 6E Wireless LAN Controllers (WLCs)",
      "University Data Center hypervisor virtual switches and SAN storage networks",
    ],
    securityRecommendations: [
      "Implement 802.1X dynamic VLAN assignment based on user role and endpoint security posture.",
      "Deploy micro-segmentation firewalls to enforce zero-trust isolation between student, administrative, and research networks.",
      "Transition remote workers from legacy VPN concentrators to Zero Trust Network Access (ZTNA) solutions.",
      "Enable automated quarantine protocols for endpoints exhibiting anomalous port-scanning behavior.",
    ],
    image: "/cyber_summit.jpg",
    imageAlt: "Network engineering team inspecting server racks and fiber optic switches",
    publisher: "SLTC ISACA Student Group",
    author: "Network Operations Group",
    trending: false,
  },
];
