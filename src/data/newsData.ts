export interface NewsItem {
  id: string;
  title: string;
  category: "Cybersecurity" | "Technology" | "AI Security" | "Digital Privacy" | "Research" | "Network Security";
  publishedDate: string;
  excerpt: string;
  content: string;
  image: string;
  featured?: boolean;
}

export const newsData: NewsItem[] = [
  {
    id: "news-1",
    title: "ICASA Research Team Highlights Emerging Vulnerability Trends",
    category: "Research",
    publishedDate: "September 02, 2026",
    excerpt: "Exploring recent developments and emerging challenges in cybersecurity.",
    content: "The research paper explores common cloud infrastructure misconfigurations, analyzing automated detection tools and least-privilege IAM policies. Published in partnership with faculty advisors from the School of Computing, the document provides actionable guidelines for university and enterprise IT administrators.",
    image: "/cyber_summit.jpg",
    featured: true,
  },
  {
    id: "news-2",
    title: "Understanding the Impact of Generative AI on Cybersecurity Defense Strategies",
    category: "AI Security",
    publishedDate: "August 28, 2026",
    excerpt: "An overview of how machine learning models are being utilized both for automated threat detection and adversary spear-phishing campaigns.",
    content: "As artificial intelligence tools become integrated into IT infrastructures, security teams face both opportunities and challenges. This article outlines modern AI-driven threat intelligence frameworks and recommended defensive postures.",
    image: "/it_audit.jpg",
  },
  {
    id: "news-3",
    title: "Best Practices for Securing Personal Data in an Interconnected Campus Ecosystem",
    category: "Digital Privacy",
    publishedDate: "August 18, 2026",
    excerpt: "Practical guidance for students and faculty members on multi-factor authentication, device encryption, and safe remote connection standards.",
    content: "With hybrid learning environments expanding across campuses, maintaining personal data privacy is paramount. Learn simple steps to audit account permissions, store passwords safely, and recognize sophisticated email phishing lures.",
    image: "/hacking_workshop.jpg",
  },
  {
    id: "news-4",
    title: "Modern Approaches to Securing Campus Networks",
    category: "Network Security",
    publishedDate: "August 12, 2026",
    excerpt: "Exploring zero-trust network architecture and automated threat response in modern university network infrastructure.",
    content: "An educational article explaining zero-trust principles, segmenting campus networks, and implementing robust firewall configurations for high-density academic environments.",
    image: "/cyber_summit.jpg",
  },
];
