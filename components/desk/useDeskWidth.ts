"use client";

import { useCallback, useRef, useState } from "react";

/** Tracks the width of the returned ref's element, matching the
 * prototype's ResizeObserver-driven `w` state (drives the mobile/wide
 * breakpoints and the stage's fixed-aspect sizing).
 *
 * Uses a callback ref (not a plain useRef + one-shot useEffect) because
 * the root element mounts late here — page.tsx renders an unref'd
 * loading shell until `mounted` is true, so a mount-once effect would
 * see `ref.current === null` and never attach the observer at all. A
 * callback ref re-fires whenever the DOM node it's attached to changes,
 * so it still hooks up correctly once the real element appears. */
export function useDeskWidth() {
  const [width, setWidth] = useState(1200);
  const observerRef = useRef<ResizeObserver | null>(null);

  const ref = useCallback((el: HTMLDivElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setWidth((prev) => (Math.abs(w - prev) > 1 ? w : prev));
    });
    ro.observe(el);
    observerRef.current = ro;
  }, []);

  return { ref, width };
}
