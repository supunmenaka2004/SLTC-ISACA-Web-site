"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const logs = [
    "INITIALIZING ICASA SYSTEM...",
    "ESTABLISHING ENCRYPTED CANAL [SSL/TLS]...",
    "VERIFYING SCHOOL OF COMPUTING PROTOCOLS...",
    "SECURITY HASH MATCHED: 0x9F4A8B2C",
    "SYSTEM STATUS: ACCESS GRANTED"
  ];

  useEffect(() => {
    setMounted(true);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
      }
      
      setProgress(currentProgress);

      if (currentProgress >= 90) {
        setCurrentStep(4);
      } else if (currentProgress >= 70) {
        setCurrentStep(3);
      } else if (currentProgress >= 45) {
        setCurrentStep(2);
      } else if (currentProgress >= 20) {
        setCurrentStep(1);
      } else {
        setCurrentStep(0);
      }
    }, 30);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200);

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
          key="icasa-cyber-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#02050a] flex flex-col items-center justify-center font-mono overflow-hidden select-none"
        >
          {/* Cyber Terminal Grid Mesh Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

          {/* Vertical Hacker Scanline */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "1000%" }}
            transition={{ duration: 1.8, ease: "linear", repeat: Infinity }}
            className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent shadow-[0_0_15px_#38bdf8] pointer-events-none z-0"
          />

          {/* Center Pulsing Ambient Glow */}
          <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Floating Cyber Data Stream Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 text-[10px] text-cyan-400 font-mono flex justify-between px-10 pt-10">
            <div className="space-y-1">
              <div>[SEC_PORT: 443]</div>
              <div>0x7F000001</div>
              <div>PROTOCOL: TLS_v1.3</div>
            </div>
            <div className="space-y-1 text-right">
              <div>MEM: 64MB OK</div>
              <div>CYBER_DECRYPT</div>
              <div>HASH: SHA256</div>
            </div>
          </div>

          {/* Central High-Tech Cyber Frame Container */}
          <div className="relative z-10 flex flex-col items-center px-6">
            
            {/* Cyber Corner Brackets */}
            <div className="relative p-6 sm:p-8 bg-slate-950/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col items-center group">
              
              {/* Top-Left Corner Bracket */}
              <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
              {/* Top-Right Corner Bracket */}
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
              {/* Bottom-Left Corner Bracket */}
              <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
              {/* Bottom-Right Corner Bracket */}
              <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

              {/* ICASA Logo Card Wrapper - Light Background Card to Make Logo POP Crisp & Bright */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] border border-white mb-6"
              >
                <img
                  src="/isaca_full_logo.png"
                  alt="ICASA Student Group Sri Lanka Technology Campus"
                  className="w-[240px] sm:w-[300px] h-auto object-contain"
                />
              </motion.div>

              {/* Progress Indicator & Glowing Status Bar */}
              <div className="w-full max-w-[300px] space-y-3 text-center">
                
                {/* Horizontal Cyber Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-900 border border-cyan-500/40 p-0.5 overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full shadow-[0_0_12px_#06b6d4] transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Cyber Terminal Status Log */}
                <div className="flex items-center justify-between text-xs font-mono font-bold tracking-wider">
                  <span className={progress >= 90 ? "text-emerald-400 drop-shadow-[0_0_8px_#10b981]" : "text-cyan-400 animate-pulse"}>
                    {logs[currentStep]}
                  </span>
                  <span className="text-white bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40 text-[11px]">
                    {progress}%
                  </span>
                </div>

              </div>

            </div>

            {/* Bottom Cyber Security Badge */}
            <div className="mt-6 flex items-center gap-2 text-[11px] text-slate-400 font-mono tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>ISACA STUDENT CHAPTER • SCHOOL OF COMPUTING</span>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
