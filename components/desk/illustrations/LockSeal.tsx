"use client";

export default function LockSeal({ size = 36 }: { size?: number }) {
  return (
    <span
      title="Members only"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        background: "radial-gradient(circle at 34% 30%, #92698a, #6b4a63 55%, #4c3346)",
        boxShadow: "0 0 0 3px rgba(107,74,99,.35), 2px 4px 6px rgba(20,10,4,.4)",
      }}
    >
      <svg width={size * 0.39} height={size * 0.44} viewBox="0 0 14 16" fill="none">
        <rect x="1.5" y="7" width="11" height="8" rx="1.5" fill="#faf3e6" />
        <path d="M4 7V5a3 3 0 0 1 6 0v2" stroke="#faf3e6" strokeWidth="1.8" />
      </svg>
    </span>
  );
}
