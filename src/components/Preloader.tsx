"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING SYSTEM");

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

      if (currentProgress >= 85) {
        setStatusText("ACCESS GRANTED");
      } else if (currentProgress >= 45) {
        setStatusText("SECURITY PROTOCOLS READY");
      } else {
        setStatusText("INITIALIZING SYSTEM");
      }
    }, 35);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (!mounted || !loading) return null;

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="icasa-minimal-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#02060d] flex flex-col items-center justify-center font-sans overflow-hidden select-none"
        >
          {/* Deep Ambient Soft Cyan Background Glow */}
          <div className="absolute w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

          {/* Central Pure Logo & Clean Minimalist Progress Wrapper */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            
            {/* Pure ICASA Logo Display (NO Rings, NO Boxes, NO Lines) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative mb-10"
            >
              <img
                src="/isaca_transparent.png"
                alt="ICASA Student Group Sri Lanka Technology Campus"
                className="w-[260px] sm:w-[340px] h-auto object-contain brightness-[1.65] contrast-[1.15] drop-shadow-[0_0_30px_rgba(56,189,248,0.25)]"
              />
            </motion.div>

            {/* Ultra-Clean Minimal Horizontal Progress Bar & Status */}
            <div className="w-56 sm:w-64 flex flex-col items-center gap-3">
              
              {/* Thin Cyan Gradient Progress Line */}
              <div className="w-full h-1 rounded-full bg-slate-900 overflow-hidden relative border border-slate-800 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-75 shadow-[0_0_10px_#06b6d4]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Status Indicator & Percentage Display */}
              <div className="flex items-center gap-3 text-xs font-mono font-bold tracking-widest uppercase">
                <span className={progress >= 85 ? "text-emerald-400 drop-shadow-[0_0_8px_#10b981]" : "text-cyan-400"}>
                  {statusText}
                </span>
                <span className="text-slate-400 font-medium">
                  [{progress}%]
                </span>
              </div>

            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
