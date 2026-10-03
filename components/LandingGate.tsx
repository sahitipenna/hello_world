"use client";

/** The very first thing a stranger sees — before any login, onboarding, or
 * pricing. One line, one button. Shown once (components/page.tsx gates it
 * on a localStorage flag, not an account) and never again after dismissed.
 * See the product-loop plan: don't ask for commitment before they've
 * experienced the magic. */
export default function LandingGate({ onStart }: { onStart: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        padding: 24,
        textAlign: "center",
        background: "radial-gradient(120% 70% at 50% 0%, #fffaf0, #faf3e6 55%, #f3e9d6)",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontFamily: "var(--font-hand), cursive",
          fontWeight: 400,
          fontSize: "clamp(48px, 10vw, 72px)",
          lineHeight: 1.15,
          color: "#2b2622",
        }}
      >
        Go Dilly
      </h1>
      <p
        style={{
          margin: 0,
          maxWidth: 420,
          fontFamily: "var(--font-serif), serif",
          fontSize: "clamp(18px, 3.2vw, 22px)",
          lineHeight: 1.5,
          color: "#4a423b",
        }}
      >
        Good morning.
        <br />
        A handful of good things for your day.
      </p>
      <button
        onClick={onStart}
        style={{
          background: "#2b2622",
          color: "#faf3e6",
          border: 0,
          borderRadius: 999,
          padding: "14px 30px",
          fontFamily: "var(--font-sans), sans-serif",
          fontSize: 16,
          fontWeight: 500,
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(20,10,4,.18)",
        }}
      >
        Start today&apos;s Dilly →
      </button>
    </div>
  );
}
