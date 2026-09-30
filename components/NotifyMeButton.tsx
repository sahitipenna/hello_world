"use client";

import { useEffect, useState } from "react";
import { DeskSkin } from "@/lib/types";

interface Viewer {
  email: string;
  name: string | null;
  image: string | null;
}

type Status = "checking" | "hidden" | "signed-out" | "off" | "working" | "on" | "denied" | "error";

/** Converts the VAPID public key (base64url, as web-push prints it) into
 * the raw Uint8Array `pushManager.subscribe` wants as `applicationServerKey`
 * — the standard conversion every Web Push how-to uses, since the Push API
 * itself only accepts the binary form. */
function urlBase64ToUint8Array(base64url: string): Uint8Array {
  const padding = "=".repeat((4 - (base64url.length % 4)) % 4);
  const base64 = (base64url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

/** "Remind me tomorrow" — opt-in Web Push notifications. Requires Google
 * sign-in (see README's "Push notifications" section for why) and a
 * configured VAPID key pair; renders nothing at all if either is missing,
 * or if this browser doesn't support the Push API (desktop Safari, iOS
 * unless added to the home screen, ...) — same graceful-degradation
 * pattern as the rest of the app's optional features. */
export default function NotifyMeButton({ user, deskSkin }: { user: Viewer | null; deskSkin: DeskSkin }) {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    if (!VAPID_PUBLIC_KEY) {
      setStatus("hidden");
      return;
    }
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("hidden");
      return;
    }
    if (!user) {
      setStatus("signed-out");
      return;
    }
    if (Notification.permission === "denied") {
      setStatus("denied");
      return;
    }

    let cancelled = false;
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => navigator.serviceWorker.ready)
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => {
        if (!cancelled) setStatus(sub ? "on" : "off");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function enable() {
    if (!VAPID_PUBLIC_KEY) return;
    setStatus("working");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "off");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
      if (!res.ok) throw new Error("subscribe failed");
      setStatus("on");
    } catch {
      setStatus("error");
    }
  }

  async function disable() {
    setStatus("working");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setStatus("off");
    } catch {
      setStatus("error");
    }
  }

  if (status === "checking" || status === "hidden") return null;

  const color = deskSkin === "dark" ? "rgba(250,243,230,.7)" : "rgba(43,38,34,.6)";
  const wrap = { textAlign: "center" as const, fontFamily: "var(--font-sans), sans-serif", fontSize: 13, color, marginTop: 4 };
  const button = {
    background: "transparent",
    border: 0,
    padding: 0,
    font: "inherit",
    color: "inherit",
    cursor: "pointer",
  };

  if (status === "signed-out") {
    return (
      <p style={wrap}>
        🔔{" "}
        <a href="/api/auth/google" className="dd-linklike" style={{ color: "inherit" }}>
          Sign in to get a daily reminder
        </a>
      </p>
    );
  }
  if (status === "denied") {
    return <p style={wrap}>🔕 Notifications are blocked in your browser settings.</p>;
  }
  if (status === "error") {
    return (
      <p style={wrap}>
        Couldn&apos;t turn that on —{" "}
        <button onClick={enable} className="dd-linklike" style={button}>
          try again
        </button>
      </p>
    );
  }
  if (status === "on") {
    return (
      <p style={wrap}>
        🔔 Daily reminders are on ·{" "}
        <button onClick={disable} className="dd-linklike" style={button}>
          turn off
        </button>
      </p>
    );
  }
  // "off" or "working"
  return (
    <p style={wrap}>
      <button onClick={enable} disabled={status === "working"} className="dd-linklike" style={{ ...button, opacity: status === "working" ? 0.6 : 1 }}>
        🔔 {status === "working" ? "Turning on…" : "Remind me tomorrow"}
      </button>
    </p>
  );
}
