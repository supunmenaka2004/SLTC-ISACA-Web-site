# SLTC ISACA Student Chapter Website 🛡️💻

Official website for the **ISACA Student Chapter at Sri Lanka Technology Campus (SLTC)**, operating under the School of Computing. Designed with an institutional dark theme, editorial publication layouts, and interactive UI components.

---

## 🌟 Key Features

- **Hero Section & Interactive Network Canvas:** Ambient cyber networking node animation built with HTML5 Canvas.
- **Who We Are (`/about-us`):** Institutional mission, vision, core values, and historical milestones timeline (`/about-us/club-history`).
- **Executive Board 2026/2027 (`/about-us#team`):** Full-photo glass overlay member cards for all 7 Executive Board positions:
  - President
  - Vice President
  - Secretary
  - Assistant Secretary
  - Treasurer
  - Assistant Treasurer
  - Web Master
- **Featured Upcoming Events Carousel:** Interactive 55%/45% horizontal split carousel slider with bottom-right `<` and `>` arrow navigation controls and event registration modals.
- **Latest Cyber News Publication:** Clean 3-column row grid of cybersecurity research advisories and articles.
- **Full Committee Directory (`/committee`):** Dedicated committee showcase page.
- **Projects & Cyber News Pages (`/projects`, `/cyber-news`):** Detailed listing of student projects and research insights.
- **Responsive Floating Pill Navigation & Footer:** Floating pill navbar and streamlined minimal footer.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine:

### 1. Prerequisites
Make sure you have **Node.js** (v18.0.0 or higher) and **npm** installed.

### 2. Clone the Repository
```bash
git clone https://github.com/supunmenaka2004/SLTC-ISACA-Web-site.git
cd SLTC-ISACA-Web-site
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001`) in your browser to see the website.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
SLTC-ISACA-Web-site/
├── public/                     # Static assets (images, logos)
├── src/
│   ├── app/                    # Next.js App Router Pages
│   │   ├── about/              # Legacy about route
│   │   ├── about-us/           # Main About Us page & club-history
│   │   ├── committee/          # Full Committee page
│   │   ├── contact/            # Contact page
│   │   ├── cyber-news/         # Cyber News listing page
│   │   ├── events/             # Events page
│   │   ├── projects/           # Projects page
│   │   ├── globals.css         # Global CSS & Tailwind setup
│   │   ├── layout.tsx          # Root Layout with Navbar & Footer
│   │   └── page.tsx            # Homepage layout
│   ├── components/             # Reusable UI Components
│   │   ├── AboutPreview.tsx
│   │   ├── CyberNewsEditorialSection.tsx
│   │   ├── EventCard.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── IsacaFullLogo.tsx
│   │   ├── Navbar.tsx
│   │   ├── NewsCard.tsx
│   │   ├── TeamMemberCard.tsx
│   │   ├── TeamPreview.tsx
│   │   └── UpcomingEventsSection.tsx
│   └── data/                   # Structured Data Modules
│       ├── committeeData.ts
│       ├── eventsData.ts
│       ├── newsData.ts
│       ├── projectsData.ts
│       └── team.ts
├── README.md                   # Project documentation
└── package.json
```

---

## 🏛️ Organization

**ISACA Student Chapter**  
School of Computing  
Sri Lanka Technology Campus (SLTC)  
*Building a safer digital future through knowledge, innovation, and technical excellence.*
