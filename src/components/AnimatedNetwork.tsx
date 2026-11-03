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

    let animId: number | null = null;
    let isVisible = true;

    const updateSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      const w = rect?.width || window.innerWidth;
      const h = rect?.height || window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      return { w, h };
    };

    let { w, h } = updateSize();

    let nodes: Node[] = [];
    let signals: PulseSignal[] = [];

    // Interactive mouse positioning
    const mouse = { x: -1000, y: -1000, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const initNodes = () => {
      nodes = [];
      signals = [];

      // Richer constellation density for vivid digital presence
      const count = w < 768 ? 45 : 85;

      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: 1.8 + Math.random() * 2.2,
          alpha: 0.45 + Math.random() * 0.5,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
        });
      }
    };

    initNodes();

    const handleResize = () => {
      const size = updateSize();
      w = size.w;
      h = size.h;
      initNodes();
    };

    window.addEventListener("resize", handleResize);

    const maxDist = w < 768 ? 120 : 160;
    const maxDistSq = maxDist * maxDist;

    const loop = () => {
      if (!isVisible) return;

      // 1. Pitch dark midnight background fill (#02060d)
      ctx.fillStyle = "#02060d";
      ctx.fillRect(0, 0, w, h);

      // 2. High-tech cyber navy radial backdrop with vibrant center
      const grad = ctx.createRadialGradient(w / 2, h / 2, 60, w / 2, h / 2, Math.max(w, h));
      grad.addColorStop(0, "#08213d");
      grad.addColorStop(0.5, "#041122");
      grad.addColorStop(1, "#02060d");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 3. Move and update nodes
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

      // 4. Draw connecting lines with high-definition neon cyan glow
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            // Clearly visible, high-definition neon cyan lines
            const lineOpacity = (1 - dist / maxDist) * 0.58;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${lineOpacity})`;
            ctx.lineWidth = 1.1;
            ctx.stroke();

            // Randomly create travelling pulse signals along line
            if (Math.random() < 0.0025 && signals.length < 10) {
              signals.push({
                fromIdx: i,
                toIdx: j,
                progress: 0,
                speed: 0.012 + Math.random() * 0.018,
              });
            }
          }
        }

        // Connect node to mouse cursor if within range
        if (mouse.active) {
          const n = nodes[i];
          const mdx = mouse.x - n.x;
          const mdy = mouse.y - n.y;
          const mdistSq = mdx * mdx + mdy * mdy;
          const mouseMaxDist = 180;
          if (mdistSq < mouseMaxDist * mouseMaxDist) {
            const mdist = Math.sqrt(mdistSq);
            const mOpacity = (1 - mdist / mouseMaxDist) * 0.75;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${mOpacity})`;
            ctx.lineWidth = 1.3;
            ctx.stroke();
          }
        }
      }

      // 5. Draw glowing nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const currentRadius = n.radius + Math.sin(n.pulse) * 0.7;
        const currentAlpha = Math.min(1, Math.max(0.35, n.alpha + Math.sin(n.pulse) * 0.25));

        // Outer Aura Glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, currentRadius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${currentAlpha * 0.35})`;
        ctx.fill();

        // Inner Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 247, 250, ${Math.min(1, currentAlpha * 1.3)})`;
        ctx.fill();
      }

      // 6. Draw travelling cyber data signals
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

          // Signal pulse glow
          ctx.beginPath();
          ctx.arc(sx, sy, 4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(34, 211, 238, 0.65)";
          ctx.fill();

          // Signal white core
          ctx.beginPath();
          ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 1)";
          ctx.fill();
        } else {
          signals.splice(s, 1);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    // IntersectionObserver to pause loop when scrolled out of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          loop();
        } else if (!isVisible && animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
      if (animId) {
        cancelAnimationFrame(animId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 block will-change-transform"
    />
  );
}
