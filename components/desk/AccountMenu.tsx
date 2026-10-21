"use client";

import { useEffect, useRef, useState } from "react";
import { Plan } from "@/lib/types";

interface Viewer {
  email: string;
  name: string | null;
  image: string | null;
}

/** The avatar in the header — clicking it no longer signs out directly
 * (that was a surprising click target); it opens a small menu instead,
 * matching the "username initial -> account menu" pattern this is modeled
 * on. Only rendered for a signed-in visitor (see DeskHeader) — anonymous
 * visitors have no avatar to click. */
export default function AccountMenu({
  user,
  plan,
  onOpenAccount,
  onOpenSettings,
  onSignOut,
}: {
  user: Viewer;
  plan: Plan;
  onOpenAccount: () => void;
  onOpenSettings: () => void;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const itemStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    textAlign: "left",
    background: "transparent",
    border: 0,
    padding: "9px 14px",
    fontFamily: "var(--font-sans), sans-serif",
    fontSize: 13.5,
    color: "#2b2622",
    cursor: "pointer",
  };

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={`Signed in as ${user.name ?? user.email}`}
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

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            zIndex: 40,
            minWidth: 190,
            background: "#fffaf0",
            borderRadius: 10,
            boxShadow: "0 12px 28px rgba(20,10,4,.3)",
            border: "1px solid rgba(43,38,34,.1)",
            overflow: "hidden",
            padding: "6px 0",
          }}
        >
          <div style={{ padding: "6px 14px 10px", borderBottom: "1px solid rgba(43,38,34,.1)", marginBottom: 4 }}>
            <p style={{ margin: 0, fontFamily: "var(--font-sans), sans-serif", fontSize: 13, fontWeight: 600, color: "#2b2622" }}>
              {user.name ?? user.email}
            </p>
            <p
              style={{
                margin: "2px 0 0",
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                color: plan !== "free" ? "#9a6d12" : "#8a8176",
              }}
            >
              {plan !== "free" ? "Member" : "Free plan"}
            </p>
          </div>
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onOpenAccount();
            }}
            style={itemStyle}
          >
            My account
          </button>
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onOpenSettings();
            }}
            style={itemStyle}
          >
            Settings
          </button>
          <div style={{ borderTop: "1px solid rgba(43,38,34,.1)", margin: "4px 0" }} />
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            style={{ ...itemStyle, color: "#a8441f" }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
