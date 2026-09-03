export interface EventItem {
  id: string;
  title: string;
  category: "Workshops" | "Seminars" | "Competitions" | "Awareness" | "Other";
  date: string;
  location: string;
  description: string;
  image: string;
  featured?: boolean;
}

export const eventsData: EventItem[] = [
  {
    id: "ev-1",
    title: "Annual University Capture The Flag (CTF) Championship 2026",
    category: "Competitions",
    date: "October 18, 2026",
    location: "Main Campus IT Auditorium & Online Sandbox",
    description: "The official university-wide cyber security challenge bringing together student teams to solve real-world security scenarios in web application defense, cryptography, and digital forensics.",
    image: "/cyber_summit.jpg",
    featured: true,
  },
  {
    id: "ev-2",
    title: "Ethical Hacking & Systems Defense Workshop",
    category: "Workshops",
    date: "September 28, 2026",
    location: "School of Computing Computer Lab 02",
    description: "A practical hands-on workshop guiding students through Linux security fundamentals, vulnerability scanning, network traffic analysis, and ethical penetration testing guidelines.",
    image: "/hacking_workshop.jpg",
    featured: true,
  },
  {
    id: "ev-3",
    title: "AI Security & Modern Cyber Threat Landscape Seminar",
    category: "Seminars",
    date: "September 10, 2026",
    location: "University Conference Center & Zoom",
    description: "An insightful seminar delivered by academic researchers and industry guest experts on threat intelligence modeling, artificial intelligence security risks, and enterprise cloud protection.",
    image: "/it_audit.jpg",
    featured: true,
  },
  {
    id: "ev-4",
    title: "Digital Safety & Privacy Awareness Campaign",
    category: "Awareness",
    date: "August 15, 2026",
    location: "Student Center Grounds",
    description: "A university community awareness initiative focusing on two-factor authentication, phishing prevention, password management, and personal data privacy.",
    image: "/hacking_workshop.jpg",
  },
  {
    id: "ev-5",
    title: "Network Protocol Analysis & Wireshark Session",
    category: "Workshops",
    date: "July 22, 2026",
    location: "Computing Seminar Hall",
    description: "An academic technical workshop covering packet inspection, packet captures analysis, network traffic monitoring, and protocol debugging.",
    image: "/cyber_summit.jpg",
  },
  {
    id: "ev-6",
    title: "Web Security & OWASP Top 10 Best Practices",
    category: "Workshops",
    date: "June 04, 2026",
    location: "Online Sandbox",
    description: "Interactive session analyzing web vulnerabilities including SQL Injection, Cross-Site Scripting (XSS), and secure coding standards for modern software applications.",
    image: "/it_audit.jpg",
  },
];
