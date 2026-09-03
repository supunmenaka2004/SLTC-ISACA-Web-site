export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  description: string;
  socialLinks: {
    linkedin?: string;
    instagram?: string;
    github?: string;
  };
}

export const executiveMembers: TeamMember[] = [
  {
    id: "pres-1",
    name: "Kavindu Perera",
    role: "President",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    description: "Leading ICASA with a focus on cybersecurity innovation, student skill development, and industry partnerships.",
    socialLinks: {
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
      github: "https://github.com",
    },
  },
  {
    id: "vp-1",
    name: "Dilini Fernando",
    role: "Vice President",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    description: "Coordinating strategic initiatives, ethical hacking workshops, and student research mentorship.",
    socialLinks: {
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
  },
  {
    id: "sec-1",
    name: "Thisara Jayasinghe",
    role: "Secretary",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    description: "Managing organizational operations, official communications, and chapter administrative governance.",
    socialLinks: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    id: "asst-sec-1",
    name: "Maneesha Rathnayake",
    role: "Assistant Secretary",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    description: "Assisting operational workflows, member onboarding, and official meeting documentations.",
    socialLinks: {
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
  },
  {
    id: "treas-1",
    name: "Nethmi Silva",
    role: "Treasurer",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    description: "Overseeing financial planning, event sponsorships, and resource allocation for club projects.",
    socialLinks: {
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
  },
  {
    id: "asst-treas-1",
    name: "Kusal Gunaratne",
    role: "Assistant Treasurer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    description: "Assisting with club financial audits, budget tracking, and event sponsorship accounts.",
    socialLinks: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    id: "webmaster-1",
    name: "Sanju Kulatunga",
    role: "Web Master",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    description: "Developing and maintaining the official ICASA Web portal, CTF platform, and digital systems.",
    socialLinks: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
];

export const fullCommitteeMembers: TeamMember[] = [
  ...executiveMembers,
  {
    id: "tech-1",
    name: "Ruwan Senanayake",
    role: "Technical Lead",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    description: "Architecting CTF competitions, hands-on lab environments, and technical infrastructure.",
    socialLinks: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    id: "event-1",
    name: "Anurangi Abeyratne",
    role: "Event Coordinator",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    description: "Organizing guest speaker seminars, cyber summits, and university-wide hackathons.",
    socialLinks: {
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
  },
];
