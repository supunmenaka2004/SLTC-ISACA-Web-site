"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING SYSTEM");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  // Lock scroll while preloader is active
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  // Background Cyber Network Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

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
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Smooth Realistic Cyber Progress Sequence (~1.2 - 1.4s total duration)
  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Non-linear realistic progress sequence
      if (currentProgress < 35) {
        currentProgress += 2.4;
      } else if (currentProgress < 75) {
        currentProgress += 2.0;
      } else if (currentProgress < 99) {
        currentProgress += 2.2;
      } else {
        currentProgress = 100;
      }

      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setProgress(100);
        setStatusText("ACCESS GRANTED");

        // Hold ACCESS GRANTED briefly so the user sees completion, then trigger exit
        const exitTimer = setTimeout(() => {
          setLoading(false);
        }, 240);

        return () => clearTimeout(exitTimer);
      }

      const floored = Math.floor(currentProgress);
      setProgress(floored);

      if (floored >= 75) {
        setStatusText("ESTABLISHING SECURE TUNNEL");
      } else if (floored >= 35) {
        setStatusText("SECURITY PROTOCOLS READY");
      } else {
        setStatusText("INITIALIZING SYSTEM");
      }
    }, 24);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!loading) return null;

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="isaca-cyber-bg-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#02050b] flex flex-col items-center justify-center font-sans overflow-hidden select-none pointer-events-auto"
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
              <div>ISACA_NET_NODE</div>
            </div>
          </div>

          {/* Central Logo & Progress Content Container */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            
            {/* Pure ISACA Logo Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative mb-10"
            >
              <img
                src="/isaca_transparent.png"
                alt="ISACA Student Group Sri Lanka Technology Campus"
                className="w-[260px] sm:w-[340px] h-auto object-contain brightness-[1.65] contrast-[1.15] drop-shadow-[0_0_30px_rgba(56,189,248,0.25)]"
              />
            </motion.div>

            {/* Ultra-Clean Minimal Horizontal Progress Bar & Status */}
            <div className="w-56 sm:w-64 flex flex-col items-center gap-3">
              
              {/* Thin Cyan Gradient Progress Line */}
              <div className="w-full h-1.5 rounded-full bg-slate-900/90 overflow-hidden relative border border-slate-800 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-75 shadow-[0_0_12px_#06b6d4]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Status Indicator & Percentage Display */}
              <div className="flex items-center gap-3 text-xs font-mono font-bold tracking-widest uppercase">
                <span className={progress >= 100 ? "text-emerald-400 drop-shadow-[0_0_10px_#10b981]" : "text-cyan-400"}>
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
