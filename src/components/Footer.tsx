"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import IsacaFullLogo from "./IsacaFullLogo";

const LinkedInIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GitHubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const YouTubeIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#03060d] text-slate-300 border-t border-slate-800/80 pt-14 pb-10 font-sans">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-slate-800/60 items-start">
          
          {/* Column 1: Brand Logo & Short Tagline */}
          <div className="md:col-span-5 flex flex-col items-start gap-3">
            <Link href="/" className="inline-block">
              <IsacaFullLogo height={48} />
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed mt-1 max-w-sm">
              Empowering students with practical cybersecurity knowledge, technical skills, and industry standards.
            </p>
          </div>

          {/* Column 2: Quick Links (Matching Navbar) */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800/60 pb-2">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-300">
              <Link href="/" className="hover:text-cyan-400 transition-colors py-1">Home</Link>
              <Link href="/about-us" className="hover:text-cyan-400 transition-colors py-1">About Us</Link>
              <Link href="/about-us#team" className="hover:text-cyan-400 transition-colors py-1">Team</Link>
              <Link href="/committee" className="hover:text-cyan-400 transition-colors py-1">Committee</Link>
              <Link href="/projects" className="hover:text-cyan-400 transition-colors py-1">Projects</Link>
              <Link href="/cyber-news" className="hover:text-cyan-400 transition-colors py-1">Cyber News</Link>
              <Link href="/contact" className="hover:text-cyan-400 transition-colors py-1">Contact</Link>
            </div>
          </div>

          {/* Column 3: Social Connect */}
          <div className="md:col-span-3 flex flex-col justify-between items-start gap-4">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800/60 pb-2">
                Connect With Us
              </h4>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                  aria-label="GitHub"
                >
                  <GitHubIcon />
                </a>
                <a
                  href="mailto:contact@icasaclub.org"
                  className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                  aria-label="Mail"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                  aria-label="YouTube"
                >
                  <YouTubeIcon />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-400">
          <div>
            © 2026 ICASA Club. All Rights Reserved.
          </div>
          <div>
            Sri Lanka Technology Campus
          </div>
        </div>

      </div>
    </footer>
  );
}
