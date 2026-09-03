export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  description: string;
  status: "Active" | "Completed" | "Ongoing";
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export const projectsData: ProjectItem[] = [
  {
    id: "proj-1",
    name: "ICASA CTF Competition Platform",
    category: "Competition Portal",
    description: "A custom web application built to host university Jeopardy-style cybersecurity competitions, featuring challenge scoring, flag verification, and live scoreboards.",
    status: "Active",
    technologies: ["Next.js", "TypeScript", "Docker", "Tailwind CSS"],
    githubUrl: "https://github.com",
    demoUrl: "https://ctf.icasaclub.org",
  },
  {
    id: "proj-2",
    name: "Student Cyber Awareness Portal",
    category: "Education Platform",
    description: "An educational web portal offering interactive learning modules, phishing awareness guidance, and password security tips for students.",
    status: "Active",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    githubUrl: "https://github.com",
  },
  {
    id: "proj-3",
    name: "Automated Repository Security Audit Tool",
    category: "Security Tool",
    description: "A lightweight static analysis tool designed to scan code repositories for exposed secrets, outdated dependencies, and security misconfigurations.",
    status: "Ongoing",
    technologies: ["Python", "Go", "Git API"],
    githubUrl: "https://github.com",
  },
  {
    id: "proj-4",
    name: "Network Traffic & Intrusion Simulation Sandbox",
    category: "Research Lab",
    description: "A controlled laboratory environment for analyzing network packet captures, testing Suricata IDS rules, and auditing security log events.",
    status: "Completed",
    technologies: ["Suricata", "Wireshark", "Linux", "Bash"],
    githubUrl: "https://github.com",
  },
  {
    id: "proj-5",
    name: "Threat Intelligence Feed Aggregator",
    category: "Threat Research",
    description: "A research project that aggregates public cybersecurity advisories and open-source IOC indicators into clean JSON data feeds.",
    status: "Active",
    technologies: ["Python", "FastAPI", "SQLite"],
    githubUrl: "https://github.com",
  },
  {
    id: "proj-6",
    name: "Campus Web Accessibility & Security Assessment",
    category: "Community Project",
    description: "A collaborative review of university student web projects, providing recommendations for web accessibility, SSL setup, and input validation.",
    status: "Completed",
    technologies: ["OWASP ZAP", "Lighthouse", "Burp Suite"],
  },
];
