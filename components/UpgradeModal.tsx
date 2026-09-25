"use client";

import { useState } from "react";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadCheckoutScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Couldn't load Razorpay Checkout"));
    document.body.appendChild(script);
  });
}

export default function UpgradeModal({
  open,
  onClose,
  onDemoUpgrade,
  onPaymentSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onDemoUpgrade: () => void;
  onPaymentSuccess: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "starting" | "error">("idle");

  if (!open) return null;

  async function handleUpgradeClick() {
    setStatus("starting");
    try {
      const res = await fetch("/api/payments/create-subscription", { method: "POST" });
      if (res.status === 503) {
        // Razorpay isn't configured on this deploy yet — fall back to the demo toggle.
        setStatus("idle");
        onDemoUpgrade();
        return;
      }
      if (!res.ok) throw new Error("couldn't start checkout");
      const { subscriptionId, keyId } = await res.json();

      await loadCheckoutScript();
      const razorpay = new window.Razorpay!({
        key: keyId,
        subscription_id: subscriptionId,
        name: "Go Dilly Premium",
        description: "₹399 / month",
        theme: { color: "#c1552c" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (verifyRes.ok) onPaymentSuccess();
          setStatus("idle");
        },
        modal: { ondismiss: () => setStatus("idle") },
      });
      razorpay.open();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative bg-paper rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-7 animate-fade-in">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-2xl leading-none text-ink/40 hover:text-ink"
        >
          {"×"}
        </button>
        <p className="text-xs font-semibold uppercase tracking-wide text-mustard mb-2">Go Dilly Premium</p>
        <h2 className="font-serif text-2xl mb-3" style={{ fontFamily: "var(--font-fraunces), serif" }}>
          More to look forward to, every day
        </h2>
        <ul className="text-sm text-ink/80 space-y-1.5 mb-5">
          <li>{"•"} All 5 world stories, and all 5 little things to do</li>
          <li>{"•"} A place worth getting lost in, every day</li>
          <li>{"•"} Reorder and hide sections to fit your day</li>
          <li>{"•"} Full archive of past days</li>
        </ul>
        <div className="flex items-baseline gap-1 mb-5">
          <span className="font-serif text-3xl" style={{ fontFamily: "var(--font-fraunces), serif" }}>
            ₹399
          </span>
          <span className="text-sm text-ink/50">/ month</span>
        </div>
        <button
          onClick={handleUpgradeClick}
          disabled={status === "starting"}
          className="w-full text-sm font-semibold bg-terracotta text-paper rounded-full px-4 py-2.5 hover:bg-rust transition-colors disabled:opacity-60"
        >
          {status === "starting" ? "Starting checkout…" : "Go Premium"}
        </button>
        {status === "error" && (
          <p className="mt-3 text-[11px] text-rust text-center">
            Something went wrong starting checkout — try again in a moment.
          </p>
        )}
      </div>
    </div>
  );
}
