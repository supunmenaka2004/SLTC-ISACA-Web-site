"use client";

import React from "react";
import { WordColor } from "@/server/db/schema";

interface WordColoredHeadingProps {
  words?: WordColor[];
  rawText?: string;
  defaultColor?: string;
  highlightColor?: string;
  className?: string;
}

const PRESET_CLASSES: Record<string, string> = {
  gradient: "bg-gradient-to-r from-[#13b5d1] via-[#29b99b] to-[#78be20] bg-clip-text text-transparent font-extrabold",
  cyan: "text-cyan-300",
  emerald: "text-emerald-400",
  sky: "text-sky-400",
  amber: "text-amber-400",
  purple: "text-purple-400",
  rose: "text-rose-400",
  white: "text-white",
};

export default function WordColoredHeading({
  words,
  rawText,
  defaultColor = "#ffffff",
  highlightColor = "#22d3ee",
  className = "",
}: WordColoredHeadingProps) {
  // If structured word color array is provided and not empty
  if (words && Array.isArray(words) && words.length > 0) {
    return (
      <span className={className}>
        {words.map((item, index) => {
          const colorKey = item.color?.toLowerCase() || "";
          const isPreset = PRESET_CLASSES[colorKey];

          if (colorKey === "gradient") {
            return (
              <span
                key={index}
                className={`inline-block mr-[0.28em] last:mr-0 ${PRESET_CLASSES.gradient}`}
              >
                {item.text}
              </span>
            );
          }

          // Custom CSS linear gradient support
          if (colorKey.includes("linear-gradient") || colorKey.includes("gradient(")) {
            return (
              <span
                key={index}
                style={{
                  backgroundImage: item.color,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                className="inline-block mr-[0.28em] last:mr-0 font-extrabold"
              >
                {item.text}
              </span>
            );
          }

          if (isPreset) {
            return (
              <span
                key={index}
                className={`inline-block mr-[0.28em] last:mr-0 ${isPreset}`}
              >
                {item.text}
              </span>
            );
          }

          // Custom hex color code or default
          const customColor = item.color || defaultColor;
          return (
            <span
              key={index}
              style={{ color: customColor }}
              className="inline-block mr-[0.28em] last:mr-0"
            >
              {item.text}
            </span>
          );
        })}
      </span>
    );
  }

  // Fallback: parse rawText with bracket support, e.g. "Who [are we]" or "Latest [cyan]Cyber News[/cyan]"
  if (rawText && typeof rawText === "string") {
    // Regex matches [color]content[/color] or [content]
    const tagRegex = /\[([a-zA-Z0-9#]+)\](.*?)\[\/\1\]|\[(.*?)\]/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tagRegex.exec(rawText)) !== null) {
      if (match.index > lastIndex) {
        const plainText = rawText.substring(lastIndex, match.index);
        parts.push(
          <span key={`plain-${lastIndex}`} style={{ color: defaultColor }}>
            {plainText}
          </span>
        );
      }

      if (match[1] && match[2]) {
        // [color]text[/color]
        const colorKey = match[1].toLowerCase();
        const content = match[2];
        const isPreset = PRESET_CLASSES[colorKey];

        if (colorKey === "gradient") {
          parts.push(
            <span key={`tag-${match.index}`} className={PRESET_CLASSES.gradient}>
              {content}
            </span>
          );
        } else if (isPreset) {
          parts.push(
            <span key={`tag-${match.index}`} className={isPreset}>
              {content}
            </span>
          );
        } else {
          parts.push(
            <span key={`tag-${match.index}`} style={{ color: match[1] }}>
              {content}
            </span>
          );
        }
      } else if (match[3]) {
        // [text] -> use highlightColor
        parts.push(
          <span key={`bracket-${match.index}`} style={{ color: highlightColor }}>
            {match[3]}
          </span>
        );
      }

      lastIndex = tagRegex.lastIndex;
    }

    if (lastIndex < rawText.length) {
      parts.push(
        <span key={`plain-end`} style={{ color: defaultColor }}>
          {rawText.substring(lastIndex)}
        </span>
      );
    }

    if (parts.length > 0) {
      return <span className={className}>{parts}</span>;
    }

    return (
      <span className={className} style={{ color: defaultColor }}>
        {rawText}
      </span>
    );
  }

  return null;
}
