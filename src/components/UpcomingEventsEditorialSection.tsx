"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, X, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { eventsData, EventItem } from "@/data/eventsData";

export default function UpcomingEventsEditorialSection() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [registered, setRegistered] = useState(false);

  const featuredEvent = eventsData.find((item) => item.featured) || eventsData[0];
  const smallEvents = eventsData.filter((item) => item.id !== featuredEvent.id).slice(0, 3);

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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
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

          {/* Outlined Pill CTA Link Button */}
          <Link
            href="/events"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-md group shrink-0"
          >
            <span>VIEW ALL EVENTS</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 text-cyan-400" />
          </Link>
        </div>

        {/* FEATURED EVENT (Top 55% / 45% Split - Clean Un-boxed Editorial Layout) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => handleOpenModal(featuredEvent)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center cursor-pointer group"
        >
          {/* Featured Image (55% Width on Desktop -> 7 Cols) */}
          <div className="lg:col-span-7 w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-2xl">
            <img
              src={featuredEvent.image}
              alt={featuredEvent.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            />
          </div>

          {/* Featured Content (45% Width on Desktop -> 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-start justify-center">
            {/* Category */}
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest block mb-2 font-sans">
              {featuredEvent.category}
            </span>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug tracking-tight group-hover:text-cyan-300 transition-colors">
              {featuredEvent.title}
            </h3>

            {/* Short Description */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-3 font-normal">
              {featuredEvent.description}
            </p>

            {/* Date */}
            <p className="text-xs text-slate-400 font-medium mt-4">
              {featuredEvent.date}
            </p>

            {/* View Event Link */}
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors uppercase tracking-wider mt-5">
              <span>VIEW EVENT</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </motion.div>

        {/* SMALL EVENTS (Bottom 3 Items in Row - 3 Clean Card Boxes) */}
        <div className="border-t border-slate-800/80 pt-12 mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {smallEvents.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => handleOpenModal(item)}
                className="bg-[#080e1c] border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-cyan-950/20 group flex flex-col h-full cursor-pointer"
              >
                {/* Cover Image */}
                <div className="relative w-full h-48 overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest block mb-2 font-sans">
                      {item.category}
                    </span>

                    <h4 className="text-base font-bold text-white leading-snug tracking-tight group-hover:text-cyan-300 transition-colors line-clamp-2 mb-3">
                      {item.title}
                    </h4>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-4">
                      {item.date}
                    </p>

                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors uppercase tracking-wider">
                      <span>VIEW EVENT</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
