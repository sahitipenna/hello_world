"use client";

import { Plan } from "@/lib/types";

interface Viewer {
  email: string;
  name: string | null;
  image: string | null;
}

/** "My account" — where the plan status that used to sit in the header
 * badge now lives, plus sign out. Reached from the avatar menu
 * (components/desk/AccountMenu.tsx). */
export default function AccountModal({
  open,
  onClose,
  user,
  plan,
  onOpenUpgrade,
  onSignOut,
}: {
  open: boolean;
  onClose: () => void;
  user: Viewer;
  plan: Plan;
  onOpenUpgrade: () => void;
  onSignOut: () => void;
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
        <p className="text-xs font-semibold uppercase tracking-wide text-mustard mb-2">My account</p>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f2e8d5] border border-ink/10 grid place-items-center text-base font-semibold shrink-0">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              (user.name ?? user.email).slice(0, 1).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <h2 className="font-serif text-xl leading-tight truncate" style={{ fontFamily: "var(--font-serif), serif" }}>
              {user.name ?? user.email}
            </h2>
            {user.name && <p className="text-sm text-ink/60 truncate">{user.email}</p>}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 px-4 py-3 mb-5">
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-wide mb-0.5"
              style={{ color: plan !== "free" ? "#9a6d12" : "#8a8176" }}
            >
              {plan !== "free" ? "Member" : "Free plan"}
            </p>
            <p className="text-xs text-ink/60">
              {plan !== "free" ? "Thanks for making this yours." : "The full edition, every day, is a tap away."}
            </p>
          </div>
          {plan === "free" && (
            <button
              onClick={() => {
                onClose();
                onOpenUpgrade();
              }}
              className="shrink-0 text-xs font-semibold bg-terracotta text-paper rounded-full px-3.5 py-2 hover:bg-rust transition-colors whitespace-nowrap"
            >
              See plans
            </button>
          )}
        </div>

        <button
          onClick={() => {
            onClose();
            onSignOut();
          }}
          className="w-full text-center text-sm font-medium text-rust border border-rust/30 rounded-full px-4 py-2.5 hover:bg-rust/5 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
