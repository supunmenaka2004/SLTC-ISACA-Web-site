"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 3;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
      }
      setProgress(currentProgress);
    }, 35);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2100);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (!mounted || !loading) return null;

  // Calculate SVG stroke dashoffset for circular progress ring
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="icasa-quantum-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#02050b] flex flex-col items-center justify-center font-sans overflow-hidden select-none"
        >
          {/* Deep Ambient Soft Radial Cyan Glow */}
          <div className="absolute w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

          {/* Central Logo & Circular HUD Progress Arc Wrapper */}
          <div className="relative z-10 flex flex-col items-center px-6">
            
            <div className="relative flex items-center justify-center mb-8">
              
              {/* SVG Glowing Circular Progress Ring */}
              <svg className="w-56 h-56 -rotate-90 pointer-events-none" viewBox="0 0 160 160">
                {/* Outer Static Track Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="text-slate-800/60"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="transparent"
                />
                {/* Animated Glowing Gradient Progress Arc */}
                <motion.circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="url(#cyan-gradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray={circumference}
                  style={{ strokeDashoffset }}
                  transition={{ ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Logo Centered Inside the Ring */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center p-6"
              >
                <img
                  src="/isaca_transparent.png"
                  alt="ICASA Student Group Sri Lanka Technology Campus"
                  className="w-[220px] sm:w-[260px] h-auto object-contain brightness-[1.65] contrast-[1.15] drop-shadow-[0_0_25px_rgba(56,189,248,0.3)]"
                />
              </motion.div>

            </div>

            {/* Clean Monospaced Minimal Status & Percentage Display */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-xs font-mono font-bold tracking-[0.25em] text-cyan-400 uppercase">
                {progress < 100 ? "INITIALIZING ICASA SYSTEM" : "SYSTEM ACCESS GRANTED"}
              </div>

              <div className="text-sm font-mono font-medium text-slate-300 tracking-widest">
                [ {progress}% ]
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
