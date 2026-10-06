"use client";

import { DeskSkin, SectionMeta } from "@/lib/types";

const SKINS: { id: DeskSkin; label: string; chip: string }[] = [
  { id: "dark", label: "Dark wood", chip: "#5d3c27" },
  { id: "light", label: "Light wood", chip: "#c89a66" },
  { id: "white", label: "White", chip: "#f3efe7" },
];

export default function ArrangeDeskCard({
  open,
  onClose,
  sections,
  order,
  hidden,
  onReorder,
  onToggleHidden,
  onResetToSuggested,
  hasInterests,
  deskSkin,
  onSkinChange,
  mobile,
  timeBudgetMinutes,
}: {
  open: boolean;
  onClose: () => void;
  sections: SectionMeta[];
  order: string[];
  hidden: string[];
  onReorder: (order: string[]) => void;
  onToggleHidden: (key: string) => void;
  onResetToSuggested: () => void;
  hasInterests: boolean;
  deskSkin: DeskSkin;
  onSkinChange: (skin: DeskSkin) => void;
  mobile: boolean;
  timeBudgetMinutes: number | null;
}) {
  if (!open) return null;

  function handleReset() {
    if (
      window.confirm(
        "Reset which sections are shown based on your chosen interests? This replaces your current show/hide choices below."
      )
    ) {
      onResetToSuggested();
    }
  }

  function move(key: string, dir: -1 | 1) {
    const idx = order.indexOf(key);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= order.length) return;
    const next = [...order];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    onReorder(next);
  }

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 60,
        top: mobile ? 120 : 84,
        right: mobile ? 12 : 28,
        left: mobile ? 12 : "auto",
        width: mobile ? "auto" : 360,
        padding: "12px 18px 14px",
        background:
          "linear-gradient(90deg, transparent 32px, rgba(193,85,44,.35) 32px 33.5px, transparent 33.5px), repeating-linear-gradient(to bottom, transparent 0 31px, rgba(79,125,140,.22) 31px 32px), #fffaf0",
        boxShadow: "0 18px 40px rgba(20,10,4,.4)",
        borderRadius: 3,
        transform: "rotate(-.8deg)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, paddingLeft: 34 }}>
        <div style={{ fontFamily: "var(--font-hand), cursive", fontWeight: 700, fontSize: 26, lineHeight: "32px" }}>
          Arrange your desk
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ background: "transparent", border: 0, fontSize: 18, cursor: "pointer", color: "#5b524a" }}
        >
          ×
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", paddingLeft: 34 }}>
        <div style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", lineHeight: "32px", color: "#5b524a" }}>
          Table
        </div>
        <div style={{ display: "flex", gap: 14, height: 64, alignItems: "flex-start" }}>
          {SKINS.map((k) => {
            const on = k.id === deskSkin;
            return (
              <button
                key={k.id}
                onClick={() => onSkinChange(k.id)}
                aria-label={k.label}
                aria-pressed={on}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "transparent", border: 0, padding: 0, cursor: "pointer" }}
              >
                <span
                  style={{
                    width: 52,
                    height: 34,
                    borderRadius: 3,
                    background:
                      k.id === "white"
                        ? k.chip
                        : `repeating-linear-gradient(92deg, rgba(0,0,0,.08) 0 1px, transparent 1px 5px), ${k.chip}`,
                    boxShadow: on ? "0 0 0 2px #fffaf0, 0 0 0 4px #c1552c" : "inset 0 0 0 1px rgba(43,38,34,.2)",
                    display: "block",
                  }}
                />
                <span style={{ fontSize: 12.5, lineHeight: 1.2, fontFamily: "var(--font-sans), sans-serif" }}>{k.label}</span>
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", lineHeight: "32px", color: "#5b524a" }}>
          On the desk
        </div>
        {order.map((key, i) => {
          const meta = sections.find((s) => s.key === key);
          if (!meta) return null;
          const on = !hidden.includes(key);
          return (
            <div key={key} style={{ display: "flex", alignItems: "flex-start", gap: 8, minHeight: 32, padding: "4px 0" }}>
              <div style={{ display: "flex", flexDirection: "column", marginTop: 6 }}>
                <button
                  disabled={i === 0}
                  onClick={() => move(key, -1)}
                  aria-label="Move up"
                  style={{ background: "transparent", border: 0, color: "rgba(43,38,34,.5)", fontSize: 9, lineHeight: 1, padding: "0 2px", cursor: "pointer" }}
                >
                  ▲
                </button>
                <button
                  disabled={i === order.length - 1}
                  onClick={() => move(key, 1)}
                  aria-label="Move down"
                  style={{ background: "transparent", border: 0, color: "rgba(43,38,34,.5)", fontSize: 9, lineHeight: 1, padding: "0 2px", cursor: "pointer" }}
                >
                  ▼
                </button>
              </div>
              <button
                onClick={() => onToggleHidden(key)}
                style={{ display: "flex", alignItems: "flex-start", gap: 12, minHeight: 32, flex: 1, background: "transparent", border: 0, padding: "4px 0", cursor: "pointer", textAlign: "left", fontSize: 15, fontFamily: "var(--font-sans), sans-serif" }}
              >
                <span
                  style={{
                    flex: "none",
                    width: 20,
                    height: 20,
                    marginTop: 2,
                    border: "1.8px solid #2b2622",
                    borderRadius: 3,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 14,
                    lineHeight: 1,
                    color: "#c1552c",
                    fontWeight: 700,
                    background: on ? "rgba(193,85,44,.06)" : "transparent",
                  }}
                >
                  {on ? "✓" : ""}
                </span>
                <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ color: on ? "#2b2622" : "rgba(43,38,34,.45)", textDecoration: on ? "none" : "line-through" }}>
                      {meta.title}
                    </span>
                    {meta.premium && (
                      <span style={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "#6b4a63" }}>members</span>
                    )}
                  </span>
                  {on && timeBudgetMinutes != null && meta.minTimeMinutes > timeBudgetMinutes && (
                    <span style={{ fontSize: 11.5, letterSpacing: ".02em", color: "#a8441f", fontStyle: "italic" }}>
                      needs more time today
                    </span>
                  )}
                </span>
              </button>
            </div>
          );
        })}
        {hasInterests && (
          <button
            onClick={handleReset}
            style={{
              marginTop: 6,
              alignSelf: "flex-start",
              background: "transparent",
              border: 0,
              padding: 0,
              cursor: "pointer",
              fontFamily: "var(--font-sans), sans-serif",
              fontSize: 12.5,
              fontWeight: 500,
              color: "#c1552c",
              textDecoration: "underline",
            }}
          >
            Reset to suggested, based on your interests
          </button>
        )}
      </div>
      <div style={{ padding: "6px 0 0 34px", fontFamily: "var(--font-serif), serif", fontStyle: "italic", fontSize: 13.5, lineHeight: "32px", color: "#5b524a" }}>
        Put things away; bring them back whenever.
      </div>
    </div>
  );
}
