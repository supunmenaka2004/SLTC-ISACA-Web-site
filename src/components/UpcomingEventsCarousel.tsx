"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { eventsData } from "@/data/eventsData";
import EventCard from "@/components/EventCard";

export default function UpcomingEventsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 3 cards visible on desktop, 2 on tablet, 1 on mobile
  const visibleCardsDesktop = 3;
  const maxIndex = Math.max(0, eventsData.length - visibleCardsDesktop);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  return (
    <section className="py-24 bg-[#050A14] font-sans relative overflow-hidden border-b border-slate-800/40">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Left Heading and Right Slider Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-800/60 pb-6">
          <div>
            {/* Category Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3 shadow-sm backdrop-blur-sm">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>EVENTS & ACTIVITIES</span>
            </div>

            {/* Gradient Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-tight">
              Upcoming <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Events</span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg mt-2 font-normal">
              Discover our workshops, seminars, and student competitions.
            </p>
          </div>

          {/* Right Side: Slider Controls (< >) + View All Link */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Prev / Next (< >) Navigation Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePrev}
                aria-label="Previous Events"
                className="w-10 h-10 rounded-xl bg-[#0a1120] border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 hover:bg-slate-800/80 transition-all flex items-center justify-center cursor-pointer shadow-md active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Events"
                className="w-10 h-10 rounded-xl bg-[#0a1120] border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 hover:bg-slate-800/80 transition-all flex items-center justify-center cursor-pointer shadow-md active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Outlined Pill CTA Link Button */}
            <Link
              href="/events"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-md group"
            >
              <span>VIEW ALL EVENTS</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 text-cyan-400" />
            </Link>
          </div>
        </div>

        {/* CAROUSEL SLIDER GRID */}
        <div className="overflow-hidden py-2">
          <motion.div
            animate={{ x: `-${currentIndex * (100 / visibleCardsDesktop)}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-6 sm:gap-8"
          >
            {eventsData.map((event) => (
              <div
                key={event.id}
                className="w-full min-w-[calc(100%-0px)] sm:min-w-[calc(50%-16px)] lg:min-w-[calc(33.333%-21.33px)] shrink-0"
              >
                <EventCard event={event} />
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
