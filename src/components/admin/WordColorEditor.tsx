"use client";

import React, { useState, useEffect } from "react";
import { WordColor } from "@/server/db/schema";
import { Palette, Sparkles, Check, RefreshCw } from "lucide-react";
import WordColoredHeading from "@/components/WordColoredHeading";
import GradientBuilder from "./GradientBuilder";

interface WordColorEditorProps {
  label: string;
  value: string;
  words?: WordColor[];
  defaultColor?: string;
  onChange: (text: string, words: WordColor[]) => void;
  helperText?: string;
}

const COLOR_PRESETS = [
  { name: "White", value: "#ffffff", preview: "bg-white", textClass: "text-white" },
  { name: "Cyan", value: "#22d3ee", preview: "bg-cyan-400", textClass: "text-cyan-400" },
  { name: "Emerald", value: "#34d399", preview: "bg-emerald-400", textClass: "text-emerald-400" },
  { name: "Sky", value: "#38bdf8", preview: "bg-sky-400", textClass: "text-sky-400" },
  { name: "Gradient", value: "gradient", preview: "bg-gradient-to-r from-[#13b5d1] via-[#29b99b] to-[#78be20]", textClass: "bg-gradient-to-r from-[#13b5d1] via-[#29b99b] to-[#78be20] bg-clip-text text-transparent font-bold" },
  { name: "Amber", value: "#facc15", preview: "bg-amber-400", textClass: "text-amber-400" },
  { name: "Purple", value: "#c084fc", preview: "bg-purple-400", textClass: "text-purple-400" },
  { name: "Rose", value: "#fb7185", preview: "bg-rose-400", textClass: "text-rose-400" },
];

export default function WordColorEditor({
  label,
  value,
  words,
  defaultColor = "#ffffff",
  onChange,
  helperText = "Click any word below to change its color or apply accent styling.",
}: WordColorEditorProps) {
  const [selectedWordIndex, setSelectedWordIndex] = useState<number>(0);
  const [customHex, setCustomHex] = useState<string>("#22d3ee");
  const [showGradientStudio, setShowGradientStudio] = useState<boolean>(false);

  // Synchronize internal words with incoming string/words
  const parsedWords: WordColor[] = React.useMemo(() => {
    const rawTokens = (value || "").trim().split(/\s+/).filter(Boolean);
    if (rawTokens.length === 0) return [];

    return rawTokens.map((token, i) => {
      const existing = words && words[i];
      if (existing && existing.text === token && existing.color) {
        return { text: token, color: existing.color };
      }
      return { text: token, color: defaultColor };
    });
  }, [value, words, defaultColor]);

  // Make sure selected index is within range
  useEffect(() => {
    if (selectedWordIndex >= parsedWords.length && parsedWords.length > 0) {
      setSelectedWordIndex(parsedWords.length - 1);
    }
  }, [parsedWords.length, selectedWordIndex]);

  const handleTextChange = (newText: string) => {
    const tokens = newText.trim().split(/\s+/).filter(Boolean);
    const updatedWords: WordColor[] = tokens.map((token, i) => {
      const old = parsedWords[i];
      if (old && old.color) {
        return { text: token, color: old.color };
      }
      return { text: token, color: defaultColor };
    });
    onChange(newText, updatedWords);
  };

  const handleSetColorForWord = (wordIndex: number, colorValue: string) => {
    const updated = parsedWords.map((w, i) => {
      if (i === wordIndex) {
        return { ...w, color: colorValue };
      }
      return w;
    });
    onChange(value, updated);
  };

  const handleApplyPresetAll = (colorValue: string) => {
    const updated = parsedWords.map((w) => ({ ...w, color: colorValue }));
    onChange(value, updated);
  };

  const handleHighlightLastWord = (highlightColor = "#22d3ee") => {
    const updated = parsedWords.map((w, i) => ({
      ...w,
      color: i === parsedWords.length - 1 ? highlightColor : defaultColor,
    }));
    onChange(value, updated);
  };

  const activeWord = parsedWords[selectedWordIndex];
  const activeColor = activeWord?.color || defaultColor;

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-[#060c18] p-4.5">
      
      {/* Header and Label */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
        <div>
          <label className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
            <span>{label}</span>
          </label>
          <p className="text-[11px] text-slate-400 mt-0.5">{helperText}</p>
        </div>

        {/* Quick Style Presets */}
        <div className="flex items-center gap-1.5 text-[10px]">
          <button
            type="button"
            onClick={() => handleHighlightLastWord("#22d3ee")}
            className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/50 transition-colors cursor-pointer"
          >
            Highlight Last
          </button>
          <button
            type="button"
            onClick={() => handleHighlightLastWord("gradient")}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Gradient Last
          </button>
          <button
            type="button"
            onClick={() => handleApplyPresetAll("#ffffff")}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            All White
          </button>
        </div>
      </div>

      {/* Main Heading Text Input */}
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="e.g. Who are we"
          className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
        />
      </div>

      {/* Word-by-Word Interactive Chips */}
      {parsedWords.length > 0 && (
        <div className="space-y-3">
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Click any word to choose its color:</span>
            {activeWord && (
              <span className="text-cyan-400 font-semibold">
                Selected: &quot;{activeWord.text}&quot;
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg bg-[#030712] border border-slate-800 min-h-[46px]">
            {parsedWords.map((w, index) => {
              const isSelected = index === selectedWordIndex;
              const isDefaultGradient = w.color === "gradient";
              const isCustomGradient = w.color?.includes("linear-gradient");

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setSelectedWordIndex(index);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                    isSelected
                      ? "ring-2 ring-cyan-400 border-cyan-400/80 bg-slate-800"
                      : "border-slate-700 bg-slate-900/80 hover:border-slate-600"
                  }`}
                >
                  {/* Dot Swatch Indicator */}
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      isDefaultGradient
                        ? "bg-gradient-to-r from-[#13b5d1] via-[#29b99b] to-[#78be20]"
                        : ""
                    }`}
                    style={
                      isCustomGradient
                        ? { backgroundImage: w.color }
                        : !isDefaultGradient
                        ? { backgroundColor: w.color || defaultColor }
                        : undefined
                    }
                  />

                  {/* Word Text with live color / gradient */}
                  <span
                    className={
                      isDefaultGradient
                        ? "bg-gradient-to-r from-[#13b5d1] via-[#29b99b] to-[#78be20] bg-clip-text text-transparent font-extrabold"
                        : ""
                    }
                    style={
                      isCustomGradient
                        ? {
                            backgroundImage: w.color,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }
                        : !isDefaultGradient
                        ? { color: w.color || defaultColor }
                        : undefined
                    }
                  >
                    {w.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Color Palette for Selected Word */}
          {activeWord && (
            <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-3.5">
              <div className="text-[11px] text-slate-300 font-medium flex items-center justify-between">
                <span>Color Swatches for &quot;<strong className="text-white">{activeWord.text}</strong>&quot;:</span>
                <span className="text-[10px] font-mono text-slate-400 truncate max-w-[200px]">
                  {activeColor}
                </span>
              </div>

              {/* Swatch Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {COLOR_PRESETS.map((preset) => {
                  const isActive = activeColor === preset.value;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSetColorForWord(selectedWordIndex, preset.value)}
                      className={`p-1.5 rounded-md border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isActive
                          ? "bg-slate-800 border-cyan-400 shadow-sm"
                          : "bg-slate-900 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full ${preset.preview} border border-black/40`} />
                      <span className="text-[10px] text-slate-300 font-medium">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Action Bar: Custom Hex Color + Gradient Studio Trigger */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-900">
                
                {/* Hex Picker */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Custom Color:</span>
                  <input
                    type="color"
                    value={activeColor.startsWith("#") ? activeColor : customHex}
                    onChange={(e) => {
                      setCustomHex(e.target.value);
                      handleSetColorForWord(selectedWordIndex, e.target.value);
                    }}
                    className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={activeColor}
                    onChange={(e) => handleSetColorForWord(selectedWordIndex, e.target.value)}
                    placeholder="#xxxxxx or linear-gradient(...)"
                    className="w-36 px-2 py-1 rounded bg-[#030712] border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 truncate"
                  />
                </div>

                {/* Open Gradient Studio Button */}
                <button
                  type="button"
                  onClick={() => setShowGradientStudio(!showGradientStudio)}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 via-emerald-500/20 to-lime-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 hover:border-cyan-400 hover:bg-cyan-500/30 transition-all cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{showGradientStudio ? "Hide Gradient Studio" : "Open Gradient Studio & Builder"}</span>
                </button>
              </div>

              {/* Embedded Gradient Studio Drawer */}
              {showGradientStudio && (
                <div className="pt-2">
                  <GradientBuilder
                    initialGradient={
                      activeColor.includes("linear-gradient")
                        ? activeColor
                        : "linear-gradient(90deg, #13b5d1 0%, #29b99b 50%, #78be20 100%)"
                    }
                    sampleText={activeWord.text}
                    onApply={(newGradient) => {
                      handleSetColorForWord(selectedWordIndex, newGradient);
                      setShowGradientStudio(false);
                    }}
                    onClose={() => setShowGradientStudio(false)}
                  />
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* Live Preview Box */}
      <div className="rounded-lg bg-[#02060d] border border-slate-800 p-4 text-center space-y-1">
        <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400/80 mb-1">
          LIVE PREVIEW (HOMEPAGE HEADING)
        </div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight">
          <WordColoredHeading
            words={parsedWords}
            rawText={value}
            defaultColor={defaultColor}
          />
        </div>
      </div>

    </div>
  );
}
