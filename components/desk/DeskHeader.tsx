"use client";

import { Plan } from "@/lib/types";
import DateStamp from "./DateStamp";
import AccountMenu from "./AccountMenu";

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
  atArchiveStart,
  onOpenInterests,
  onOpenArrange,
  onOpenShelf,
  shelfCount,
  onOpenCreative,
  showCreativeLink,
  user,
  onSignOut,
  onOpenAccount,
  onOpenSettings,
  mobile,
  wide,
}: {
  plan: Plan;
  dateISO: string;
  dayOfYear: number;
  onDateChange: (iso: string) => void;
  atArchiveStart?: boolean;
  onOpenInterests: () => void;
  onOpenArrange: () => void;
  onOpenShelf: () => void;
  shelfCount: number;
  // Only shown while today's creative-activity prompt is still
  // unanswered, so a visitor who hit "Not today" has a way back to it.
  onOpenCreative: () => void;
  showCreativeLink: boolean;
  user: Viewer | null;
  onSignOut: () => void;
  onOpenAccount: () => void;
  onOpenSettings: () => void;
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

      <DateStamp dateISO={dateISO} dayOfYear={dayOfYear} onChange={onDateChange} mobile={mobile} atArchiveStart={atArchiveStart} />

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
        <button
          onClick={onOpenShelf}
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
          Your shelf{shelfCount > 0 ? ` (${shelfCount})` : ""}
        </button>
        {showCreativeLink && (
          <button
            onClick={onOpenCreative}
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
            Today&apos;s thought
          </button>
        )}
        {/* The "Member" badge that used to sit here now lives inside the
            account menu / "My account" modal instead — a signed-in-only
            status belongs behind the signed-in-only avatar, not loose in
            the header. Header "Sign in" CTA stays removed (see
            SaveSignInPrompt and ShelfModal for where sign-in is offered). */}
        {user && (
          <AccountMenu user={user} plan={plan} onOpenAccount={onOpenAccount} onOpenSettings={onOpenSettings} onSignOut={onSignOut} />
        )}
      </div>
    </header>
  );
}
