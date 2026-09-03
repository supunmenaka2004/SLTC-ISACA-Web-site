"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, X, ShieldCheck } from "lucide-react";
import { EventItem } from "@/data/eventsData";

export default function EventCard({ event }: { event: EventItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const [registered, setRegistered] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#080e1c] border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-cyan-950/20 group flex flex-col h-full cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        {/* Event Image (55-60% of card height) */}
        <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-slate-900 shrink-0">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        </div>

        {/* Card Body - Clean Editorial Layout */}
        <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
          <div>
            {/* Category - Small Uppercase Text */}
            <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest block mb-2 font-sans">
              {event.category}
            </span>

            {/* Event Title - Main Visual Focus */}
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug tracking-tight group-hover:text-cyan-300 transition-colors line-clamp-2 mb-3">
              {event.title}
            </h3>
          </div>

          <div>
            {/* Date - Small Muted Gray Text */}
            <p className="text-xs text-slate-400 font-medium mb-4">
              {event.date}
            </p>

            {/* View Event -> Simple Text Link */}
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors uppercase tracking-wider">
              <span>VIEW EVENT</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Event Details View Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-sans">
          <div className="bg-[#0d1527] rounded-2xl border border-slate-700/80 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1 block">
                  {event.category}
                </span>
                <h3 className="text-xl font-bold text-white leading-snug">
                  {event.title}
                </h3>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {event.description}
              </p>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs sm:text-sm text-slate-300">
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Location:</strong> {event.location}</p>
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
                    Thank you! We look forward to seeing you at {event.location}.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
