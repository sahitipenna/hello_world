"use client";

import { useEffect } from "react";

/** Optional — only loads Microsoft Clarity's tracking script when
 * NEXT_PUBLIC_CLARITY_PROJECT_ID is set, so local dev and a
 * not-yet-configured deploy work without it (same pattern as
 * PostHogProvider). Clarity gives free, unlimited heatmaps and session
 * recordings with rage-click/dead-click detection — a different lens
 * than PostHog's event/funnel analytics, not a replacement for it. */
export default function ClarityProvider() {
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
    if (!id || (window as unknown as { clarity?: unknown }).clarity) return;

    // Clarity's own embed snippet (clarity.ms), adapted for a React effect
    // instead of inline <script> tags.
    (function (c: Window, l: Document, a: string, r: string, i: string) {
      const w = c as unknown as Record<string, (...args: unknown[]) => void>;
      w[a] =
        w[a] ||
        function (...args: unknown[]) {
          ((w[a] as unknown as { q?: unknown[] }).q = (w[a] as unknown as { q?: unknown[] }).q || []).push(args);
        };
      const t = l.createElement(r) as HTMLScriptElement;
      t.async = true;
      t.src = `https://www.clarity.ms/tag/${i}`;
      const y = l.getElementsByTagName(r)[0];
      y.parentNode?.insertBefore(t, y);
    })(window, document, "clarity", "script", id);
  }, []);

  return null;
}
