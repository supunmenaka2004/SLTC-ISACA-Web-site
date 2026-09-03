"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING ICASA SYSTEM...");

  useEffect(() => {
    // Check if preloader has already been shown in this browser session
    const hasLoaded = sessionStorage.getItem("icasa_preloader_seen");
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setLoading(false);
      return;
    }

    // Smooth Progress timer (0% to 100% in ~1.8 seconds)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 3;
        
        // Dynamic status text sequence
        if (next >= 85) {
          setStatusText("ACCESS GRANTED");
        } else if (next >= 40) {
          setStatusText("SECURITY PROTOCOLS READY");
        } else {
          setStatusText("INITIALIZING ICASA SYSTEM...");
        }

        return next;
      });
    }, 35);

    // Timeout to smoothly hide preloader at 100%
    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("icasa_preloader_seen", "true");
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (!loading) return null;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#02060d] flex flex-col items-center justify-center font-sans overflow-hidden select-none"
        >
          {/* Subtle Vertical Digital Scanning Line */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "1000%" }}
            transition={{ duration: 2.2, ease: "linear", repeat: Infinity }}
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent pointer-events-none"
          />

          {/* Ambient Background Glow */}
          <div className="absolute w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Central Content Container */}
          <div className="relative z-10 flex flex-col items-center px-6">
            
            {/* Official ICASA Logo Container */}
            <div className="relative mb-8 overflow-hidden rounded-xl p-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10"
              >
                <img
                  src="/isaca_full_logo.png"
                  alt="ICASA Student Group Sri Lanka Technology Campus"
                  className="w-[240px] sm:w-[320px] h-auto object-contain drop-shadow-[0_0_25px_rgba(34,211,238,0.18)]"
                />
              </motion.div>

              {/* Light Sweep Highlight Overlay */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent skew-x-12 pointer-events-none z-20"
              />
            </div>

            {/* Minimal Horizontal Progress Indicator */}
            <div className="w-56 sm:w-64 h-1 rounded-full bg-slate-800/80 overflow-hidden relative border border-slate-700/50 mb-4 shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            {/* Status Text & Percentage Display */}
            <div className="flex items-center gap-3 text-xs font-mono font-bold tracking-widest text-slate-300">
              <span className={progress >= 85 ? "text-emerald-400" : "text-cyan-400"}>
                {statusText}
              </span>
              <span className="text-slate-400 font-normal">
                [{progress}%]
              </span>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
