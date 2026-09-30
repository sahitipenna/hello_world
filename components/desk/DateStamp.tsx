"use client";

import { parseISODate, toISODate } from "@/lib/dateUtils";

function shiftDate(iso: string, days: number): string {
  const d = parseISODate(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return toISODate(d);
}

export default function DateStamp({
  dateISO,
  dayOfYear,
  onChange,
  mobile,
}: {
  dateISO: string;
  dayOfYear: number;
  onChange: (iso: string) => void;
  mobile: boolean;
}) {
  const today = toISODate(new Date());
  const atToday = dateISO === today;
  const d = parseISODate(dateISO);
  const dayName = d.toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" });
  const dateLabel = d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <div
      style={mobile ? { order: 3, width: "100%", display: "flex", justifyContent: "center", paddingBottom: 4 } : { flex: "none" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={() => onChange(shiftDate(dateISO, -1))}
          aria-label="Previous day"
          className="dd-daynav"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "1.5px solid #a8441f",
            background: "transparent",
            color: "#a8441f",
            fontFamily: "var(--font-serif), serif",
            fontSize: 20,
            lineHeight: 1,
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
          }}
        >
          ‹
        </button>
        <div
          style={{
            border: "2px solid #a8441f",
            borderRadius: 6,
            padding: "5px 16px",
            color: "#a8441f",
            transform: "rotate(-1.5deg)",
            textAlign: "center",
            boxShadow: "inset 0 0 0 3px #faf3e6, inset 0 0 0 4px rgba(168,68,31,.45)",
            minWidth: 210,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontWeight: 600,
              fontSize: 10.5,
              lineHeight: 1.3,
              letterSpacing: ".18em",
              textTransform: "uppercase",
            }}
          >
            {dayName} · No. {dayOfYear}
          </div>
          <div style={{ fontFamily: "var(--font-serif), serif", fontWeight: 500, fontSize: 20, lineHeight: 1.15 }}>{dateLabel}</div>
        </div>
        <button
          onClick={() => !atToday && onChange(shiftDate(dateISO, 1))}
          aria-label="Next day"
          disabled={atToday}
          className="dd-daynav"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "1.5px solid #a8441f",
            background: "transparent",
            color: "#a8441f",
            fontFamily: "var(--font-serif), serif",
            fontSize: 20,
            lineHeight: 1,
            cursor: atToday ? "default" : "pointer",
            display: "grid",
            placeItems: "center",
            opacity: atToday ? 0.3 : 1,
          }}
        >
          ›
        </button>
        {!atToday && (
          <button
            onClick={() => onChange(today)}
            style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontSize: 12,
              color: "#4f7d8c",
              textDecoration: "underline",
              textDecorationStyle: "dotted",
              textUnderlineOffset: "3px",
              background: "none",
              border: 0,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Jump to today
          </button>
        )}
      </div>
    </div>
  );
}
