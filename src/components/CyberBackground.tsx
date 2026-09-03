"use client";

import { motion } from "framer-motion";

export default function CyberBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030712]">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {/* Radial Gradient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-blue-600/10 blur-[140px]" />
      <div className="absolute bottom-10 left-1/3 w-[30rem] h-[30rem] rounded-full bg-emerald-500/5 blur-[150px]" />

      {/* Animated Subtle Floating Connection Particles */}
      <motion.div
        animate={{
          opacity: [0.15, 0.35, 0.15],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent"
      />
    </div>
  );
}
