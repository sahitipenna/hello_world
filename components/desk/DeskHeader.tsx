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
        {plan === "free" ? (
          wide && (
            <button
              onClick={onOpenUpgrade}
              className="dd-member-pill"
              style={{
                background: "transparent",
                border: "1.5px solid #2b2622",
                borderRadius: 999,
                padding: "7px 14px",
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: 13.5,
                whiteSpace: "nowrap",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Become a member
            </button>
          )
        ) : (
          <span
            style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "#9a6d12",
              border: "1.5px solid rgba(154,109,18,.5)",
              borderRadius: 999,
              padding: "6px 12px",
              whiteSpace: "nowrap",
            }}
          >
            Member
          </span>
        )}
        {user ? (
          <button
            onClick={onSignOut}
            title={`Signed in as ${user.name ?? user.email} — click to sign out`}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              overflow: "hidden",
              border: "1px solid rgba(43,38,34,.15)",
              display: "grid",
              placeItems: "center",
              fontSize: 12,
              fontWeight: 600,
              background: "#f2e8d5",
              cursor: "pointer",
            }}
          >
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" />
            ) : (
              (user.name ?? user.email).slice(0, 1).toUpperCase()
            )}
          </button>
        ) : (
          <a
            href="/api/auth/google"
            className="dd-linklike"
            style={{ fontFamily: "var(--font-sans), sans-serif", fontSize: 14, whiteSpace: "nowrap" }}
          >
            Sign in
          </a>
        )}
      </div>
    </header>
  );
}
