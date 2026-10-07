"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/track";

/** Tracks active (foreground, visible-tab) time and reports it in chunks as
 * UsageEvent "session_time" rows — not "tab was open" time, time the tab
 * was actually the visible one, so /admin's Insights tab can show real
 * minutes-spent instead of counting backgrounded tabs people forgot about.
 * Mounted once in app/layout.tsx so it covers every page, not just the
 * desk. `document`/`window` are only ever touched inside useEffect, which
 * only runs client-side — this component still gets server-rendered, and
 * referencing either in the initial render would throw. */
export default function SessionTimeTracker() {
  const visibleSince = useRef<number | null>(null);

  useEffect(() => {
    visibleSince.current = document.visibilityState === "visible" ? Date.now() : null;

    function flush() {
      if (visibleSince.current == null) return;
      const elapsed = Date.now() - visibleSince.current;
      visibleSince.current = null;
      if (elapsed > 1000) track("session_time", undefined, elapsed);
    }
    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        visibleSince.current = Date.now();
      } else {
        flush();
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, []);

  return null;
}
