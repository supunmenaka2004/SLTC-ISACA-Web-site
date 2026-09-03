"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING SYSTEM");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background Cyber Network Canvas Animation
  useEffect(() => {
    setMounted(true);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        let animId: number;
        const w = (canvas.width = window.innerWidth);
        const h = (canvas.height = window.innerHeight);

        const nodes: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = [];
        const nodeCount = w < 768 ? 25 : 50;

        for (let i = 0; i < nodeCount; i++) {
          nodes.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: 1.2 + Math.random() * 1.5,
          });
        }

        const render = () => {
          ctx.clearRect(0, 0, w, h);

          for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              const n1 = nodes[i];
              const n2 = nodes[j];
              const dx = n2.x - n1.x;
              const dy = n2.y - n1.y;
              const distSq = dx * dx + dy * dy;

              if (distSq < 140 * 140) {
                const opacity = (1 - Math.sqrt(distSq) / 140) * 0.25;
                ctx.beginPath();
                ctx.moveTo(n1.x, n1.y);
                ctx.lineTo(n2.x, n2.y);
                ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
              }
            }
          }

          for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            n.x += n.vx;
            n.y += n.vy;

            if (n.x < 0 || n.x > w) n.vx *= -1;
            if (n.y < 0 || n.y > h) n.vy *= -1;

            ctx.beginPath();
            ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(186, 230, 253, 0.6)";
            ctx.fill();
          }

          animId = requestAnimationFrame(render);
        };

        render();

        return () => {
          cancelAnimationFrame(animId);
        };
      }
    }
  }, []);

  // Progress Timer
  useEffect(() => {
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
          key="icasa-cyber-preloader-exit"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: "blur(16px)",
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#02050b] flex flex-col items-center justify-center font-sans overflow-hidden select-none pointer-events-none"
        >
          {/* Cyber Network Canvas Background Layer */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0 block"
          />

          {/* Cyber Grid Mesh Matrix Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none z-0" />

          {/* Deep Ambient Soft Cyan Background Radial Glow */}
          <div className="absolute w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none z-0 animate-pulse" />

          {/* Subtle Corner Cyber Data Streams */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25 text-[10px] text-cyan-400 font-mono flex justify-between p-8 z-0">
            <div className="space-y-1">
              <div>[SYSTEM_STATUS: ACTIVE]</div>
              <div>PORT: 443 // TLS_v1.3</div>
              <div>0x7F000001</div>
            </div>
            <div className="space-y-1 text-right">
              <div>CYBER_DECRYPT</div>
              <div>HASH: SHA256</div>
              <div>ICASA_NET_NODE</div>
            </div>
          </div>

          {/* Top Sliding Cyber Shutter Panel (Exit Animation) */}
          <motion.div
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 inset-x-0 h-1/2 bg-[#02050b] border-b border-cyan-500/30 z-1"
          />

          {/* Bottom Sliding Cyber Shutter Panel (Exit Animation) */}
          <motion.div
            exit={{ y: "100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 inset-x-0 h-1/2 bg-[#02050b] border-t border-cyan-500/30 z-1"
          />

          {/* Central Logo & Progress Content Container (Fades & Zooms on Exit) */}
          <motion.div
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center px-6 text-center"
          >
            {/* Pure ICASA Logo Display */}
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
                <span className={progress >= 85 ? "text-emerald-400 drop-shadow-[0_0_10px_#10b981]" : "text-cyan-400"}>
                  {statusText}
                </span>
                <span className="text-slate-400 font-medium">
                  [{progress}%]
                </span>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
