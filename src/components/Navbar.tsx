"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import IsacaFullLogo from "./IsacaFullLogo";

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "Team", href: "/about-us#team" },
    { name: "Committee", href: "/committee" },
    { name: "Projects", href: "/projects" },
    { name: "Cyber News", href: "/cyber-news" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none transform-gpu border-b border-white/[0.08] bg-[#050a14]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
        
        {/* Primary navigation */}
        <div className="min-h-[72px] px-1 sm:px-2 flex items-center justify-between gap-5 transition-colors">
          
          {/* Left: Official Full ISACA Brand Logo */}
          <Link href="/" className="flex items-center group shrink-0">
            <IsacaFullLogo height={52} />
          </Link>

          {/* Center/Right Navigation Links in User Specified Order */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 font-sans">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === "/about-us" && pathname.startsWith("/about-us"));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-2.5 xl:px-3 py-2 text-[12px] xl:text-[13px] font-medium transition-colors relative ${
                    isActive
                      ? "text-cyan-200 after:absolute after:inset-x-2.5 after:-bottom-[2px] after:h-px after:bg-cyan-300"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white border border-slate-700/70 rounded-sm transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="lg:hidden mb-3 bg-[#0b1220] border border-slate-800 shadow-2xl rounded-lg p-5"
            >
              <div className="flex flex-col gap-2 font-sans">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href === "/about-us" && pathname.startsWith("/about-us"));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`text-sm font-medium px-4 py-3 rounded-md transition-colors ${
                        isActive
                          ? "bg-slate-800/70 text-cyan-200 border-l-2 border-cyan-400"
                          : "text-slate-300 hover:bg-slate-800/40 hover:text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
}
