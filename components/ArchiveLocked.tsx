"use client";

import { FREE_ARCHIVE_DAYS } from "@/lib/archive";

export default function ArchiveLocked({ onUpgradeClick }: { onUpgradeClick: () => void }) {
  return (
    <div className="text-center py-16 px-4">
      <p className="font-serif text-2xl sm:text-3xl mb-3" style={{ fontFamily: "var(--font-serif), serif" }}>
        That one's further back than free plans go
      </p>
      <p className="text-ink/60 max-w-sm mx-auto mb-8">
        Free Dillies keep the last {FREE_ARCHIVE_DAYS} days. Members can revisit every past edition, whenever they
        want to.
      </p>
      <button
        onClick={onUpgradeClick}
        className="text-sm font-semibold bg-ink text-paper rounded-full px-5 py-2.5 hover:bg-ink/85 transition-colors"
      >
        See membership
      </button>
    </div>
  );
}
