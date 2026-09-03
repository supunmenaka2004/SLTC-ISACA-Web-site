"use client";

import { motion } from "framer-motion";
import { BookOpen, Lightbulb, Shield, Users, Target, Eye } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      title: "Knowledge",
      description: "Fostering continuous learning, practical technical mastery, and academic research in information security.",
      icon: BookOpen,
    },
    {
      title: "Innovation",
      description: "Encouraging students to build, experiment, and solve real-world technology challenges through creative engineering.",
      icon: Lightbulb,
    },
    {
      title: "Responsibility",
      description: "Promoting ethical practices, digital safety awareness, data privacy, and responsible disclosure standards.",
      icon: Shield,
    },
    {
      title: "Collaboration",
      description: "Building an inclusive community that connects students, faculty mentors, and industry experts.",
      icon: Users,
    },
  ];

  return (
    <div className="pt-32 pb-24 font-sans bg-[#070d19] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-16 pb-8 border-b border-white/10">
          <div className="inline-block px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3 font-mono border border-cyan-500/20">
            About Us
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            About ICASA Club
          </h1>
        </div>

        {/* Section 1: About ICASA Description & Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Empowering Students for a Secure Digital World
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              ICASA Club is an official student-led university organization operating within the School of Computing. Founded by technology enthusiasts, the club provides an open platform for students interested in cybersecurity, software engineering, systems auditing, and digital risk management.
            </p>
            <p className="text-slate-300 text-base leading-relaxed">
              Our initiatives include practical technical workshops, Capture The Flag (CTF) competitions, guest lectures from industry professionals, and research publications. We aim to bridge theoretical university coursework with practical industry applications.
            </p>
          </div>

          <div className="lg:col-span-5 glass-card rounded-xl p-8 border border-white/10 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2 font-mono">
              University Affiliation
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Recognized Student Chapter under School of Computing</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Guided by Senior Faculty Advisors</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Aligned with Global Cyber Standards</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section 2: Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="glass-card p-8 border-cyan-500/20">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 shadow-sm">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Our Mission
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              To empower students with cybersecurity knowledge, technical skills and opportunities for innovation through hands-on education, collaborative projects, and industry engagement.
            </p>
          </div>

          <div className="glass-card p-8 border-white/10">
            <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/10 text-white flex items-center justify-center mb-4 shadow-sm">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Our Vision
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              To cultivate a knowledgeable and responsible generation capable of contributing to a safer digital society and leading future cybersecurity innovations.
            </p>
          </div>
        </div>

        {/* Section 3: What We Stand For */}
        <div>
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              What We Stand For
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              The foundational principles guiding our community and activities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="glass-card p-6">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
