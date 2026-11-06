"use client";

import { useEffect, useState } from "react";
import { ThemeColors, ThemeTypography, ThemeConfiguration } from "@/server/db/schema";
import { defaultTheme } from "@/server/db/defaults";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfiguration>(defaultTheme);

  useEffect(() => {
    async function loadTheme() {
      try {
        const res = await fetch("/api/public/site-data");
        if (res.ok) {
          const data = await res.json();
          if (data.theme) {
            setTheme(data.theme);
          }
        }
      } catch {
        // Fallback to default theme on network or offline
      }
    }

    loadTheme();
  }, []);

  const { colors, typography, components } = theme;

  // Generate dynamic CSS variables
  const cssVariables = `
    :root {
      --bg-main: ${colors.bgMain};
      --bg-section: ${colors.bgSection};
      --bg-card: ${colors.bgCard};

      --text-white: ${colors.textWhite};
      --text-slate: ${colors.textSlate};
      --text-muted: ${colors.textMuted};

      --cyan-accent: ${colors.cyanAccent};
      --sky-accent: ${colors.skyAccent};
      --emerald-accent: ${colors.emeraldAccent};

      --border-card: ${colors.borderCard};
      --border-hover: ${colors.borderHover};

      --btn-bg: ${colors.buttonBg};
      --btn-text: ${colors.buttonText};
      --btn-border: ${colors.buttonBorder};

      --font-heading: ${typography.headingFont};
      --font-body: ${typography.bodyFont};
      --base-font-size: ${typography.baseFontSize || "16px"};
      --heading-weight: ${typography.headingWeight || "700"};
      --line-height: ${typography.lineHeight || "1.6"};
      --letter-spacing: ${typography.letterSpacing || "-0.02em"};

      --btn-radius: ${components.buttonRadius === "none" ? "0px" : components.buttonRadius === "sm" ? "4px" : components.buttonRadius === "md" ? "8px" : "9999px"};
      --card-radius: ${components.cardRadius || "0.875rem"};
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      {children}
    </>
  );
}
