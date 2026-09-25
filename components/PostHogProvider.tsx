"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

/** Optional — only initializes when NEXT_PUBLIC_POSTHOG_KEY is set, so
 * local dev and a not-yet-configured deploy work without it. Pageviews are
 * captured automatically; app/page.tsx calls posthog.identify(userId) once
 * it knows the visitor's own id, so repeat visits (and, once signed in,
 * the same person across devices) roll up as one person in PostHog's
 * retention/cohort views instead of one row per browser session. */
export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || posthog.__loaded) return;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: true,
      person_profiles: "identified_only",
    });
  }, []);

  return <>{children}</>;
}

export function identifyVisitor(userId: string, traits?: Record<string, unknown>) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || !posthog.__loaded) return;
  posthog.identify(userId, traits);
}
