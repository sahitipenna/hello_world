"use client";

/** Fire-and-forget usage event, written to our own DB (see UsageEvent in
 * schema.prisma) so /admin's Insights tab can show real per-user activity
 * with no third-party analytics account required. Never awaited by the
 * caller, and never allowed to throw into it — a failed or slow tracking
 * call must never block or break the interaction it's attached to.
 * sendBeacon (when available) survives the page unloading right after the
 * call, which matters most for "session_time", fired on tab-hide/unload. */
export function track(type: string, key?: string, valueMs?: number) {
  try {
    const payload = JSON.stringify({ type, key, valueMs });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/track", blob);
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Tracking is strictly best-effort.
  }
}
