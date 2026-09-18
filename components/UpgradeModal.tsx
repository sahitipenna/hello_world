"use client";

export default function UpgradeModal({
  open,
  onClose,
  onUpgrade,
}: {
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
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
        <p className="text-xs font-semibold uppercase tracking-wide text-mustard mb-2">Daybook Premium</p>
        <h2 className="font-serif text-2xl mb-3" style={{ fontFamily: "var(--font-fraunces), serif" }}>
          More to look forward to, every day
        </h2>
        <ul className="text-sm text-ink/80 space-y-1.5 mb-5">
          <li>{"•"} Mini crossword, comic break, art spotlight, and travel postcard</li>
          <li>{"•"} Reorder and hide sections to fit your day</li>
          <li>{"•"} Full archive of past days</li>
        </ul>
        <div className="flex items-baseline gap-1 mb-5">
          <span className="font-serif text-3xl" style={{ fontFamily: "var(--font-fraunces), serif" }}>
            $4
          </span>
          <span className="text-sm text-ink/50">/ month</span>
        </div>
        <button
          onClick={onUpgrade}
          className="w-full text-sm font-semibold bg-terracotta text-paper rounded-full px-4 py-2.5 hover:bg-rust transition-colors"
        >
          Try Premium (demo)
        </button>
        <p className="mt-3 text-[11px] text-ink/40 text-center">
          Demo only &mdash; no payment is collected. This flips a local preference so you can see the premium layout.
        </p>
      </div>
    </div>
  );
}
