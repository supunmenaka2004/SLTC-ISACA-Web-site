"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { eventsData, EventItem } from "@/data/eventsData";

export default function UpcomingEventsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [registered, setRegistered] = useState(false);

  const activeEvent = eventsData[currentIndex] || eventsData[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : eventsData.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < eventsData.length - 1 ? prev + 1 : 0));
  };

  const handleOpenModal = (event: EventItem) => {
    setSelectedEvent(event);
    setRegistered(false);
  };

  return (
    <section className="py-24 bg-[#050A14] font-sans relative overflow-hidden border-b border-slate-800/40">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Styled Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            {/* Category Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3 shadow-sm backdrop-blur-sm">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>EVENTS & ACTIVITIES</span>
            </div>

            {/* Prominent Large Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-[48px] font-extrabold text-white tracking-tight leading-tight">
              Upcoming <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Events</span>
            </h2>

            {/* Cyan Gradient Underline Accent Bar */}
            <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full my-4" />

            <p className="text-slate-300 text-base sm:text-lg font-normal">
              Discover our workshops, seminars, and student competitions.
            </p>
          </div>

          {/* Outlined Pill CTA Link Button */}
          <Link
            href="/events"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-md group shrink-0"
          >
            <span>VIEW ALL EVENTS</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 text-cyan-400" />
          </Link>
        </div>

        {/* FEATURED EVENT CAROUSEL (55% / 45% Split Layout with Bottom-Right < > Navigation Buttons) */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEvent.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center group"
            >
              {/* Left Side: 55% Image Container */}
              <div className="lg:col-span-7 w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-2xl relative">
                <img
                  src={activeEvent.image}
                  alt={activeEvent.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                />
                
                {/* Event Counter Chip on Image */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-xs font-bold text-slate-300 font-mono">
                  {currentIndex + 1} / {eventsData.length}
                </div>
              </div>

              {/* Right Side: 45% Content Area */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full py-2">
                <div>
                  {/* Category */}
                  <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest block mb-2 font-sans">
                    {activeEvent.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug tracking-tight">
                    {activeEvent.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-3 font-normal">
                    {activeEvent.description}
                  </p>

                  {/* Date & Location */}
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
                    <span>📅 {activeEvent.date}</span>
                    <span>📍 {activeEvent.location}</span>
                  </div>

                  {/* View Event Link Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenModal(activeEvent)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider mt-5 cursor-pointer group/view"
                  >
                    <span>VIEW EVENT</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/view:translate-x-1" />
                  </button>
                </div>

                {/* BOTTOM RIGHT: Arrow Navigation Buttons (< >) ONLY */}
                <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-800/60">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous Event"
                    className="w-11 h-11 rounded-xl bg-[#0a1120] border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/40 transition-all flex items-center justify-center cursor-pointer shadow-lg active:scale-95 group/btn"
                  >
                    <ChevronLeft className="w-5 h-5 transition-transform group-hover/btn:-translate-x-0.5" />
                  </button>

                  <button
                    onClick={handleNext}
                    aria-label="Next Event"
                    className="w-11 h-11 rounded-xl bg-[#0a1120] border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/40 transition-all flex items-center justify-center cursor-pointer shadow-lg active:scale-95 group/btn"
                  >
                    <ChevronRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Event Registration & Details View Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-sans">
          <div className="bg-[#0d1527] rounded-2xl border border-slate-700/80 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1 block">
                  {selectedEvent.category}
                </span>
                <h3 className="text-xl font-bold text-white leading-snug">
                  {selectedEvent.title}
                </h3>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {selectedEvent.description}
              </p>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs sm:text-sm text-slate-300">
                <p><strong>Date:</strong> {selectedEvent.date}</p>
                <p><strong>Location:</strong> {selectedEvent.location}</p>
              </div>

              {!registered ? (
                <button
                  onClick={() => setRegistered(true)}
                  className="w-full py-3 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-all cursor-pointer uppercase tracking-wider shadow-md"
                >
                  Register for Event
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto" />
                  <h4 className="text-xs sm:text-sm font-bold text-white">Registration Confirmed</h4>
                  <p className="text-xs text-slate-400">
                    Thank you! We look forward to seeing you at {selectedEvent.location}.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
