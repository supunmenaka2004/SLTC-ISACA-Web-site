export interface ResourceItem {
  id: string;
  title: string;
  category: "Cybersecurity" | "Networking" | "Programming" | "Ethical Hacking" | "Research" | "Learning Materials";
  description: string;
  linkText: string;
  url: string;
}

export const resourcesData: ResourceItem[] = [
  // Cybersecurity
  {
    id: "res-1",
    title: "Cybersecurity Fundamentals Guide",
    category: "Cybersecurity",
    description: "An introductory learning roadmap covering key concepts in digital security, threat modeling, access control, and defense-in-depth principles.",
    linkText: "View Learning Guide",
    url: "https://roadmap.sh/cyber-security",
  },
  {
    id: "res-2",
    title: "NIST Cybersecurity Framework Overview",
    category: "Cybersecurity",
    description: "Official documentation and executive summary of the NIST CSF 2.0 framework for identifying, protecting, detecting, and responding to cyber risks.",
    linkText: "Read NIST Framework",
    url: "https://www.nist.gov/cyberframework",
  },

  // Networking
  {
    id: "res-3",
    title: "TCP/IP & Network Protocol Basics",
    category: "Networking",
    description: "Comprehensive guide to network layers, IPv4/IPv6 addressing, subnetting, DNS resolution, and common protocol handshakes.",
    linkText: "Explore Networking Docs",
    url: "https://www.wireshark.org/docs/",
  },

  // Programming
  {
    id: "res-4",
    title: "Secure Coding Standards & Practices",
    category: "Programming",
    description: "Guidelines for writing resilient software in Python, TypeScript, and Java, preventing input injection and unhandled exceptions.",
    linkText: "Read Coding Guidelines",
    url: "https://owasp.org/www-project-top-ten/",
  },

  // Ethical Hacking
  {
    id: "res-5",
    title: "Web Application Pentesting Basics",
    category: "Ethical Hacking",
    description: "Educational materials demonstrating SQL injection detection, Cross-Site Scripting (XSS), and HTTP header security checks in laboratory sandboxes.",
    linkText: "Access Pentesting Guide",
    url: "https://portswigger.net/web-security",
  },

  // Research & Learning Materials
  {
    id: "res-6",
    title: "ICASA Security Cheatsheets & Reference Guides",
    category: "Learning Materials",
    description: "Student-compiled quick reference sheets for common Linux commands, Wireshark packet filters, Nmap scan flags, and Git workflows.",
    linkText: "Download Reference Sheets",
    url: "#",
  },
  {
    id: "res-7",
    title: "Academic Research & Journal Resources",
    category: "Research",
    description: "Recommended academic journals, IEEE security publications, and open-access research repositories for university computer science students.",
    linkText: "Explore Research Papers",
    url: "https://scholar.google.com",
  },
];
