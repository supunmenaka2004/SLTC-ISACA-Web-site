export interface CommitteeMember {
  id: string;
  name: string;
  position: string;
  initials: string;
  category: "Executive" | "Technical" | "Operations";
  bio: string;
  linkedin: string;
  github?: string;
  email: string;
  image?: string;
}

export const committeeData: CommitteeMember[] = [
  {
    id: "com-1",
    name: "Kasun Perera",
    position: "President",
    initials: "KP",
    category: "Executive",
    bio: "Final year Cybersecurity student leading student operations, academic initiatives, and external industry relations.",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    email: "president@isacaclub.org",
  },
  {
    id: "com-2",
    name: "Achini Silva",
    position: "Vice President",
    initials: "AS",
    category: "Executive",
    bio: "Specializing in Cloud Systems and Digital Trust. Co-managing community workshops and academic event schedules.",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    email: "vp@isacaclub.org",
  },
  {
    id: "com-3",
    name: "Thilina Bandara",
    position: "Secretary",
    initials: "TB",
    category: "Executive",
    bio: "Software Engineering student overseeing member communications, meeting documentation, and constitutional governance.",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    email: "secretary@isacaclub.org",
  },
  {
    id: "com-4",
    name: "Sashini Jayawardena",
    position: "Assistant Secretary",
    initials: "SJ",
    category: "Executive",
    bio: "Computer Science student assisting with event logistics, membership records, and official university correspondence.",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    email: "asst.secretary@isacaclub.org",
  },
  {
    id: "com-5",
    name: "Dilum Fernando",
    position: "Treasurer",
    initials: "DF",
    category: "Executive",
    bio: "Focusing on IT Governance and Audit. Managing club financial accounts, event budgets, and sponsorship records.",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    email: "treasurer@isacaclub.org",
  },
  {
    id: "com-6",
    name: "Kusal Gunaratne",
    position: "Assistant Treasurer",
    initials: "KG",
    category: "Executive",
    bio: "Assisting with club financial audits, budget tracking, and event sponsorship accounts.",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    email: "asst.treasurer@isacaclub.org",
  },
  {
    id: "com-7",
    name: "Sanju Kulatunga",
    position: "Web Master",
    initials: "SK",
    category: "Technical",
    bio: "Developing and maintaining the official ISACA Web portal, CTF platform, and digital systems.",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    email: "webmaster@isacaclub.org",
  },
  {
    id: "com-8",
    name: "Ravindu Wickramasinghe",
    position: "Technical Lead",
    initials: "RW",
    category: "Technical",
    bio: "Leading technical lab environments, Capture The Flag (CTF) challenges, and student cybersecurity research projects.",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    email: "techlead@isacaclub.org",
  },
  {
    id: "com-9",
    name: "Dinithi Alwis",
    position: "Event Coordinator",
    initials: "DA",
    category: "Operations",
    bio: "Coordinating logistics for seminars, workshops, awareness campaigns, and student community gatherings.",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    email: "events@isacaclub.org",
  },
];

export const committeeMembers = committeeData;
