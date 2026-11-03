"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

export default function NewsShareButton({ title }: { title: string }) {
  const [message, setMessage] = useState("");

  async function shareArticle() {
    const shareData = { title, url: window.location.href };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setMessage("Article shared");
      } else {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(shareData.url);
        } else {
          const input = document.createElement("textarea");
          input.value = shareData.url;
          input.setAttribute("readonly", "");
          input.style.position = "fixed";
          input.style.opacity = "0";
          document.body.appendChild(input);
          input.select();
          const copied = document.execCommand("copy");
          input.remove();
          if (!copied) throw new Error("Clipboard unavailable");
        }
        setMessage("Article link copied");
      }
    } catch {
      setMessage("Could not share this article");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={shareArticle} className="inline-flex items-center gap-2 border border-[var(--border-card)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--text-slate)] transition-colors hover:border-[var(--border-hover)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--cyan-accent)]">
        <Share2 className="h-4 w-4 text-[var(--cyan-accent)]" aria-hidden="true" /> Share story
      </button>
      <span className="text-xs text-[var(--text-muted)]" aria-live="polite">{message}</span>
    </div>
  );
}
