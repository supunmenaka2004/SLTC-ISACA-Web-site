"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulse: number;
  pulseSpeed: number;
}

interface PulseSignal {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
}

export default function AnimatedNetwork() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const updateSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      const w = rect?.width || window.innerWidth;
      const h = rect?.height || window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      return { w, h };
    };

    let { w, h } = updateSize();

    const handleResize = () => {
      const size = updateSize();
      w = size.w;
      h = size.h;
      initNodes();
    };

    window.addEventListener("resize", handleResize);

    let nodes: Node[] = [];
    let signals: PulseSignal[] = [];

    const initNodes = () => {
      nodes = [];
      signals = [];

      const count = w < 768 ? 40 : 85;

      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: 1.5 + Math.random() * 2,
          alpha: 0.3 + Math.random() * 0.5,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
        });
      }
    };

    initNodes();

    const maxDist = w < 768 ? 110 : 160;

    const loop = () => {
      // Pitch dark midnight background fill (#02060d)
      ctx.fillStyle = "#02060d";
      ctx.fillRect(0, 0, w, h);

      // Deep dark radial glow
      const grad = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, Math.max(w, h));
      grad.addColorStop(0, "#061324");
      grad.addColorStop(0.6, "#030814");
      grad.addColorStop(1, "#02040a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 1. Move and update nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0) { n.x = 0; n.vx *= -1; }
        if (n.x > w) { n.x = w; n.vx *= -1; }
        if (n.y < 0) { n.y = 0; n.vy *= -1; }
        if (n.y > h) { n.y = h; n.vy *= -1; }

        n.pulse += n.pulseSpeed;
      }

      // 2. Draw connecting lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const lineOpacity = (1 - dist / maxDist) * 0.35;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineOpacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Randomly create travelling pulse signal along line
            if (Math.random() < 0.0008 && signals.length < 8) {
              signals.push({
                fromIdx: i,
                toIdx: j,
                progress: 0,
                speed: 0.01 + Math.random() * 0.015,
              });
            }
          }
        }
      }

      // 3. Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const currentRadius = n.radius + Math.sin(n.pulse) * 0.6;
        const currentAlpha = Math.min(1, Math.max(0.2, n.alpha + Math.sin(n.pulse) * 0.2));

        // Node Glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, currentRadius * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${currentAlpha * 0.2})`;
        ctx.fill();

        // Solid Node Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${currentAlpha})`;
        ctx.fill();
      }

      // 4. Draw travelling data signals
      for (let s = signals.length - 1; s >= 0; s--) {
        const sig = signals[s];
        const n1 = nodes[sig.fromIdx];
        const n2 = nodes[sig.toIdx];

        if (n1 && n2) {
          sig.progress += sig.speed;
          if (sig.progress >= 1) {
            signals.splice(s, 1);
            continue;
          }

          const sx = n1.x + (n2.x - n1.x) * sig.progress;
          const sy = n1.y + (n2.y - n1.y) * sig.progress;

          ctx.beginPath();
          ctx.arc(sx, sy, 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.fill();
        } else {
          signals.splice(s, 1);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 block"
    />
  );
}
