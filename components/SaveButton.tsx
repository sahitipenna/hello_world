"use client";

/** The "discovery" affordance behind My Dilly Shelf — every bookmarkable
 * piece of content gets one of these. Deliberately plain/small: this is a
 * personal "I want to remember this" action, not a social share button. */
export default function SaveButton({
  saved,
  onToggle,
  size = "normal",
}: {
  saved: boolean;
  onToggle: () => void;
  size?: "normal" | "small";
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={saved}
      aria-label={saved ? "Remove from your shelf" : "Save to your shelf"}
      title={saved ? "Saved to your shelf" : "Save to your shelf"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: "transparent",
        border: 0,
        padding: 0,
        cursor: "pointer",
        fontFamily: "var(--font-sans), sans-serif",
        fontSize: size === "small" ? 12.5 : 13.5,
        fontWeight: 500,
        color: saved ? "#9a6d12" : "#5b524a",
      }}
    >
      <span aria-hidden style={{ fontSize: size === "small" ? 14 : 15 }}>
        {saved ? "★" : "☆"}
      </span>
      {saved ? "Saved" : "Save"}
    </button>
  );
}
