"use client";

import { Plan } from "@/lib/types";
import DateStamp from "./DateStamp";

interface Viewer {
  email: string;
  name: string | null;
  image: string | null;
}

export default function DeskHeader({
  plan,
  dateISO,
  dayOfYear,
  onDateChange,
  onOpenInterests,
  onOpenArrange,
  onOpenUpgrade,
  user,
  onSignOut,
  mobile,
  wide,
}: {
  plan: Plan;
  dateISO: string;
  dayOfYear: number;
  onDateChange: (iso: string) => void;
  onOpenInterests: () => void;
  onOpenArrange: () => void;
  onOpenUpgrade: () => void;
  user: Viewer | null;
  onSignOut: () => void;
  mobile: boolean;
  wide: boolean;
}) {
  return (
    <header
      style={{
        position: "relative",
        zIndex: 30,
        flex: "none",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px 20px",
        padding: "12px clamp(16px,3vw,32px)",
        background: "#faf3e6",
        borderBottom: "2px dotted rgba(43,38,34,.22)",
        boxShadow: "0 6px 16px rgba(20,10,4,.28)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flex: mobile ? "none" : "1 1 0",
          width: mobile ? "100%" : undefined,
          minWidth: 140,
          order: mobile ? 1 : undefined,
        }}
      >
        <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h1 style={{ margin: 0, fontFamily: "var(--font-hand), cursive", fontWeight: 400, fontSize: 40, lineHeight: 1.2 }}>
            Go Dilly
          </h1>
        </a>
      </div>

      <DateStamp dateISO={dateISO} dayOfYear={dayOfYear} onChange={onDateChange} mobile={mobile} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: mobile ? "center" : "flex-end",
          flexWrap: "wrap",
          gap: 16,
          flex: mobile ? "none" : "1 1 0",
          width: mobile ? "100%" : undefined,
          minWidth: 140,
          order: mobile ? 3 : undefined,
        }}>
        <button
          onClick={onOpenInterests}
          className="dd-linklike"
          style={{
            background: "transparent",
            border: 0,
            padding: "6px 2px",
            fontFamily: "var(--font-sans), sans-serif",
            fontSize: 14,
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
        >
          Interests
        </button>
        <button
          onClick={onOpenArrange}
          className="dd-linklike"
          style={{
            background: "transparent",
            border: 0,
            padding: "6px 2px",
            fontFamily: "var(--font-sans), sans-serif",
            fontSize: 14,
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
        >
          Arrange your desk
        </button>
        {/* Member / sign-in hidden for now, per request — not ready to surface yet. */}
      </div>
    </header>
  );
}
