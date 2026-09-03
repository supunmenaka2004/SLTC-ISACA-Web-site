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
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        
        {/* Floating Horizontal Pill Navbar */}
        <div className="bg-[#111827]/95 backdrop-blur-md border border-slate-800/80 shadow-2xl shadow-black/60 rounded-full px-5 sm:px-8 py-2 sm:py-2.5 flex items-center justify-between transition-all">
          
          {/* Left: Official Full ISACA Brand Logo */}
          <Link href="/" className="flex items-center group shrink-0 ml-1 sm:ml-3">
            <IsacaFullLogo height={58} />
          </Link>

          {/* Center/Right Navigation Links in User Specified Order */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 font-sans">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === "/about-us" && pathname.startsWith("/about-us"));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all relative ${
                    isActive
                      ? "bg-slate-800/90 text-white border border-blue-500/40 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/40"
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
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-full bg-slate-800/80 border border-slate-700/60"
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
              className="lg:hidden mt-2 bg-[#111827] border border-slate-800 shadow-2xl rounded-2xl p-5"
            >
              <div className="flex flex-col gap-2 font-sans">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href === "/about-us" && pathname.startsWith("/about-us"));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all ${
                        isActive
                          ? "bg-slate-800 text-white border border-blue-500/40"
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
