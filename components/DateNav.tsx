"use client";

import { parseISODate, toISODate } from "@/lib/dateUtils";

function shiftDate(iso: string, days: number): string {
  const d = parseISODate(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return toISODate(d);
}

function formatPretty(iso: string): string {
  const d = parseISODate(iso);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export default function DateNav({
  dateISO,
  dayOfYear,
  onChange,
}: {
  dateISO: string;
  dayOfYear: number;
  onChange: (iso: string) => void;
}) {
  const today = toISODate(new Date());
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={() => onChange(shiftDate(dateISO, -1))}
        aria-label="Previous day"
        className="w-8 h-8 rounded-full border border-ink/15 flex items-center justify-center hover:bg-ink/5 transition-colors"
      >
        {"←"}
      </button>
      <div className="text-center min-w-[220px]">
        <p className="font-serif text-lg sm:text-xl" style={{ fontFamily: "var(--font-fraunces), serif" }}>
          {formatPretty(dateISO)}
        </p>
        <p className="text-xs text-ink/45">Day {dayOfYear} of the year</p>
      </div>
      <button
        onClick={() => onChange(shiftDate(dateISO, 1))}
        aria-label="Next day"
        className="w-8 h-8 rounded-full border border-ink/15 flex items-center justify-center hover:bg-ink/5 transition-colors"
      >
        {"→"}
      </button>
      {dateISO !== today && (
        <button
          onClick={() => onChange(today)}
          className="text-xs font-medium text-sky underline decoration-dotted underline-offset-4"
        >
          Jump to today
        </button>
      )}
    </div>
  );
}
