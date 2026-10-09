"use client";

/** Shown once, the first time an anonymous visitor saves something —
 * their bookmark already saved to this browser's own session (toggleBookmark
 * in app/page.tsx never waits on this), so this is an invitation layered on
 * top, not a gate: declining it loses nothing today, it just means the
 * save only lives in this browser's cookie instead of following them to a
 * signed-in account. app/page.tsx tracks the "already shown" flag in
 * localStorage (a per-viewer convenience, not data that needs to survive
 * anywhere else) so it never nags on a second save. */
export default function SaveSignInPrompt({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

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
        <p className="text-xs font-semibold uppercase tracking-wide text-terracotta mb-2">Saved to your shelf</p>
        <h2 className="font-serif text-2xl mb-3" style={{ fontFamily: "var(--font-serif), serif" }}>
          Keep it there for good
        </h2>
        <p className="text-sm text-ink/70 mb-5">
          That's saved to this browser for now — sign in with Google and it'll follow you instead: same shelf on
          your phone, your laptop, wherever you open Go Dilly next.
        </p>
        <a
          href="/api/auth/google"
          className="block w-full text-center text-sm font-semibold bg-terracotta text-paper rounded-full px-4 py-2.5 hover:bg-rust transition-colors"
        >
          Sign in with Google
        </a>
        <button
          onClick={onClose}
          className="w-full text-center text-xs text-ink/50 mt-3 underline decoration-dotted underline-offset-4"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
