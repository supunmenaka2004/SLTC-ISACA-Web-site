"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Check,
  X,
  Sliders,
  RotateCw,
  Copy,
  Layers,
  Palette,
  ArrowRight,
} from "lucide-react";

interface GradientBuilderProps {
  initialGradient?: string;
  sampleText?: string;
  onApply: (cssGradient: string) => void;
  onClose: () => void;
}

const CURATED_GRADIENT_PRESETS = [
  {
    name: "ISACA Triple",
    css: "linear-gradient(90deg, #13b5d1 0%, #29b99b 50%, #78be20 100%)",
    category: "Brand",
  },
  {
    name: "Electric Cyan",
    css: "linear-gradient(90deg, #00f2fe 0%, #4facfe 100%)",
    category: "Cyber",
  },
  {
    name: "Cyber Emerald",
    css: "linear-gradient(90deg, #10b981 0%, #06b6d4 100%)",
    category: "Cyber",
  },
  {
    name: "Neon Violet",
    css: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
    category: "Neon",
  },
  {
    name: "Solar Amber",
    css: "linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)",
    category: "Warm",
  },
  {
    name: "Deep Ocean",
    css: "linear-gradient(135deg, #38bdf8 0%, #3b82f6 50%, #6366f1 100%)",
    category: "Cool",
  },
  {
    name: "Laser Pink",
    css: "linear-gradient(90deg, #ff0844 0%, #ffb199 100%)",
    category: "Neon",
  },
  {
    name: "Titanium Silver",
    css: "linear-gradient(90deg, #ffffff 0%, #94a3b8 100%)",
    category: "Neutral",
  },
];

const QUICK_COLORS = [
  "#13b5d1",
  "#00f2fe",
  "#22d3ee",
  "#3b82f6",
  "#10b981",
  "#29b99b",
  "#78be20",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#a855f7",
  "#ffffff",
];

export default function GradientBuilder({
  initialGradient = "linear-gradient(90deg, #13b5d1 0%, #29b99b 50%, #78be20 100%)",
  sampleText = "Who are we",
  onApply,
  onClose,
}: GradientBuilderProps) {
  // Parsing initial gradient or fallback
  const [stop1, setStop1] = useState("#13b5d1");
  const [hasMiddleStop, setHasMiddleStop] = useState(true);
  const [stopMiddle, setStopMiddle] = useState("#29b99b");
  const [stop2, setStop2] = useState("#78be20");
  const [angle, setAngle] = useState(90);
  const [copied, setCopied] = useState(false);

  // Generate current CSS gradient string
  const currentCssGradient = hasMiddleStop
    ? `linear-gradient(${angle}deg, ${stop1} 0%, ${stopMiddle} 50%, ${stop2} 100%)`
    : `linear-gradient(${angle}deg, ${stop1} 0%, ${stop2} 100%)`;

  const handleApplyPreset = (presetCss: string) => {
    // Basic regex parser for presets
    const angleMatch = presetCss.match(/(\d+)deg/);
    if (angleMatch) setAngle(parseInt(angleMatch[1], 10));

    const hexMatches = presetCss.match(/#[a-fA-F0-9]{6}/g);
    if (hexMatches && hexMatches.length >= 2) {
      setStop1(hexMatches[0]);
      if (hexMatches.length >= 3) {
        setHasMiddleStop(true);
        setStopMiddle(hexMatches[1]);
        setStop2(hexMatches[2]);
      } else {
        setHasMiddleStop(false);
        setStop2(hexMatches[1]);
      }
    }
  };

  const copyCss = () => {
    navigator.clipboard.writeText(currentCssGradient);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-cyan-500/30 bg-[#070e1c] p-5 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Interactive Gradient Studio & Builder</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-mono">
                LIVE
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Create custom multi-color linear gradients and apply them to any word or heading.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close Gradient Studio"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Live Preview Display Box */}
      <div className="rounded-xl bg-[#03060d] border border-slate-800 p-5 text-center space-y-3 relative overflow-hidden">
        {/* Subtle glow behind preview */}
        <div
          className="absolute inset-0 opacity-15 blur-2xl pointer-events-none"
          style={{ background: currentCssGradient }}
        />

        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
          GRADIENT TEXT PREVIEW
        </div>

        {/* Text rendered in the live custom gradient */}
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight relative z-10 py-1">
          <span
            style={{
              backgroundImage: currentCssGradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {sampleText || "Who are we"}
          </span>
        </div>

        {/* Color Bar */}
        <div
          className="w-full h-3.5 rounded-full border border-white/10 shadow-inner"
          style={{ background: currentCssGradient }}
        />

        {/* CSS Code Badge with Copy Button */}
        <div className="flex items-center justify-center gap-2 pt-1 font-mono text-[11px] text-slate-400">
          <code className="px-2 py-1 rounded bg-slate-900 border border-slate-800 truncate max-w-sm sm:max-w-md">
            {currentCssGradient}
          </code>
          <button
            type="button"
            onClick={copyCss}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Copy CSS Gradient"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Curated Preset Library */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quick Gradient Presets</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CURATED_GRADIENT_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset.css)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group cursor-pointer"
            >
              <div
                className="w-full h-4 rounded-md mb-1.5 border border-black/30 group-hover:scale-[1.02] transition-transform"
                style={{ background: preset.css }}
              />
              <span className="text-[11px] font-semibold text-slate-200 block truncate group-hover:text-cyan-300">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Color Stops Customization Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* Stop 1 (Start) */}
        <div className="p-3 rounded-lg bg-[#030712] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 font-mono">
            <span>Color 1 (Start)</span>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stop1 }} />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={stop1}
              onChange={(e) => setStop1(e.target.value)}
              className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={stop1}
              onChange={(e) => setStop1(e.target.value)}
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="flex flex-wrap gap-1 pt-1">
            {QUICK_COLORS.slice(0, 6).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setStop1(c)}
                className="w-4 h-4 rounded-full border border-black/50 hover:scale-125 transition-transform"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Stop 2 (Middle - Optional) */}
        <div className="p-3 rounded-lg bg-[#030712] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 font-mono">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hasMiddleStop}
                onChange={(e) => setHasMiddleStop(e.target.checked)}
                className="rounded accent-cyan-500"
              />
              <span>Color 2 (Middle)</span>
            </label>
            {hasMiddleStop && (
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stopMiddle }} />
            )}
          </div>
          {hasMiddleStop ? (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={stopMiddle}
                  onChange={(e) => setStopMiddle(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={stopMiddle}
                  onChange={(e) => setStopMiddle(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {QUICK_COLORS.slice(4, 10).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setStopMiddle(c)}
                    className="w-4 h-4 rounded-full border border-black/50 hover:scale-125 transition-transform"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-[11px] text-slate-500 py-4 text-center italic">
              2-Color Gradient Mode active
            </div>
          )}
        </div>

        {/* Stop 3 (End) */}
        <div className="p-3 rounded-lg bg-[#030712] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 font-mono">
            <span>Color 3 (End)</span>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stop2 }} />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={stop2}
              onChange={(e) => setStop2(e.target.value)}
              className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={stop2}
              onChange={(e) => setStop2(e.target.value)}
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="flex flex-wrap gap-1 pt-1">
            {QUICK_COLORS.slice(6, 12).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setStop2(c)}
                className="w-4 h-4 rounded-full border border-black/50 hover:scale-125 transition-transform"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Direction & Angle Control */}
      <div className="p-3.5 rounded-lg bg-[#030712] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <RotateCw className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <span className="text-xs font-semibold text-slate-200 block font-mono">
              Gradient Direction / Angle: <strong className="text-cyan-400">{angle}°</strong>
            </span>
            <div className="flex items-center gap-1.5 mt-1.5">
              {[
                { label: "→ Right (90°)", val: 90 },
                { label: "↘ Diagonal (135°)", val: 135 },
                { label: "↓ Down (180°)", val: 180 },
                { label: "↗ Up-Right (45°)", val: 45 },
              ].map((dir) => (
                <button
                  key={dir.val}
                  type="button"
                  onClick={() => setAngle(dir.val)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors cursor-pointer ${
                    angle === dir.val
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                      : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  {dir.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Angle Slider */}
        <div className="w-full sm:w-48 flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="360"
            step="5"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <span className="text-xs font-mono text-cyan-300 w-10 text-right">{angle}°</span>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => onApply(currentCssGradient)}
          className="px-5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Apply This Gradient to Word</span>
        </button>
      </div>

    </div>
  );
}
