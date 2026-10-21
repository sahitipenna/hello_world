"use client";

import NotifyMeButton from "./NotifyMeButton";

interface Viewer {
  email: string;
  name: string | null;
  image: string | null;
}

/** Account-level settings, reached from the avatar menu. Starts small
 * (just notifications) — desk appearance already has a home in "Arrange
 * your desk", so it isn't duplicated here; this is the natural place to
 * add more account-wide preferences later. */
export default function SettingsModal({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: Viewer | null;
}) {
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
        <p className="text-xs font-semibold uppercase tracking-wide text-mustard mb-2">Settings</p>
        <h2 className="font-serif text-2xl mb-4" style={{ fontFamily: "var(--font-serif), serif" }}>
          Notifications
        </h2>
        <p className="text-sm text-ink/70 mb-4">A nudge once a day, nothing more — easy to turn off again.</p>
        <div className="rounded-xl border border-ink/10 px-4 py-3">
          <NotifyMeButton user={user} deskSkin="white" />
        </div>
      </div>
    </div>
  );
}
