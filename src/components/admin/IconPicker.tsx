"use client";

import React, { useState } from "react";
import { Search, X, Check, Sparkles } from "lucide-react";
import DynamicIcon, { AVAILABLE_ICONS, ICON_MAP, IconDefinition } from "../DynamicIcon";

interface IconPickerProps {
  label: string;
  value?: string;
  onChange: (iconName: string) => void;
  helperText?: string;
}

const CATEGORIES = ["All", "Security", "People", "Badges", "Events", "News", "Tech", "Actions"];

// Fast selection presets
const POPULAR_PRESETS = [
  "ShieldCheck",
  "Users",
  "Award",
  "Calendar",
  "Newspaper",
  "Cpu",
  "Rocket",
  "Zap",
  "Star",
  "Globe",
];

export default function IconPicker({
  label,
  value = "ShieldCheck",
  onChange,
  helperText,
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredIcons = AVAILABLE_ICONS.filter((icon) => {
    const matchesCat = activeCategory === "All" || icon.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      icon.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-300 font-mono uppercase">
          {label}
        </label>
        {helperText && <span className="text-[11px] text-slate-500">{helperText}</span>}
      </div>

      {/* Selected Icon Trigger Box */}
      <div className="flex items-center gap-3 bg-[#030712] border border-slate-700 rounded-lg p-2.5">
        <div className="w-9 h-9 rounded-md bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
          <DynamicIcon name={value} className="w-5 h-5 text-cyan-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-white truncate font-mono">
            {value || "No icon selected"}
          </div>
          <div className="text-[10px] text-slate-400">
            Selected Lucide Vector Icon
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-3 py-1.5 bg-slate-800 hover:bg-cyan-900/60 hover:text-cyan-300 text-slate-200 border border-slate-700 hover:border-cyan-500/50 rounded text-xs font-medium transition-colors cursor-pointer"
        >
          Browse Sample Icons
        </button>
      </div>

      {/* Quick Select Presets Strip */}
      <div className="flex items-center gap-1.5 flex-wrap pt-1">
        <span className="text-[10px] text-slate-500 font-mono uppercase mr-1">Quick Picks:</span>
        {POPULAR_PRESETS.map((iconName) => {
          const isSelected = value === iconName;
          return (
            <button
              key={iconName}
              type="button"
              onClick={() => onChange(iconName)}
              title={iconName}
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                isSelected
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <DynamicIcon name={iconName} className="w-3.5 h-3.5" />
            </button>
          );
        })}
      </div>

      {/* Icon Picker Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#090f1d] border border-cyan-500/40 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#040813]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Select Section Icon</h3>
                  <p className="text-[11px] text-slate-400">
                    Choose from 50+ curated cyber, leadership &amp; event icons
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search & Category Filter */}
            <div className="p-4 border-b border-slate-800 space-y-3 bg-[#070d19]">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search icons by name (e.g. shield, users, calendar, award)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#030712] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer ${
                      activeCategory === cat
                        ? "bg-cyan-500 text-slate-950 font-bold"
                        : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Grid Content */}
            <div className="p-4 overflow-y-auto flex-1 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 bg-[#030712]/50">
              {filteredIcons.map((icon) => {
                const isSelected = value === icon.name;
                return (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() => handleSelect(icon.name)}
                    className={`p-3 rounded-lg border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group ${
                      isSelected
                        ? "bg-cyan-950/70 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/50"
                        : "bg-[#090f1d] border-slate-800 hover:border-cyan-500/50 hover:bg-[#0c1527] text-slate-300 hover:text-white"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-md bg-slate-900/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <DynamicIcon name={icon.name} className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-[11px] font-mono truncate w-full">
                      {icon.name}
                    </span>
                    {isSelected && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] text-cyan-400 uppercase font-semibold">
                        <Check className="w-2.5 h-2.5" /> Selected
                      </span>
                    )}
                  </button>
                );
              })}

              {filteredIcons.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500 text-xs">
                  No icons found matching &quot;{searchQuery}&quot;. Try searching another keyword.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between bg-[#040813] text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                Showing {filteredIcons.length} of {AVAILABLE_ICONS.length} sample icons
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
