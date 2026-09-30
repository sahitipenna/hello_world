import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#faf3e6",
        paper2: "#f2e8d5",
        "paper-hi": "#fffaf0",
        ink: "#2b2622",
        "ink-soft": "#4a423b",
        "ink-muted": "#5b524a",
        terracotta: "#c1552c",
        rust: "#a8441f",
        sage: "#6d7f5c",
        mustard: "#d9a02c",
        plum: "#6b4a63",
        sky: "#4f7d8c",
        "seal-hi": "#92698a",
        "seal-lo": "#4c3346",
        "wood-dark": "#5d3c27",
        "wood-light": "#c89a66",
        "table-white": "#f3efe7",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Iowan Old Style", "Palatino Linotype", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        hand: ["var(--font-hand)", "cursive"],
        display: ["var(--font-serif)", "serif"],
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        card: "0 1px 0 rgba(43,38,34,0.05), 0 8px 24px -12px rgba(43,38,34,0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
