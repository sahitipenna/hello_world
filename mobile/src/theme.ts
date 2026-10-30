// Mirrors tailwind.config.ts and app/layout.tsx on the web app — same
// palette and fonts, so the iOS app reads as the same product rather than
// a reskin. Keep these two files in sync by hand if the web palette changes.

export const colors = {
  paper: "#faf3e6",
  paper2: "#f2e8d5",
  paperHi: "#fffaf0",
  ink: "#2b2622",
  inkSoft: "#4a423b",
  inkMuted: "#5b524a",
  terracotta: "#c1552c",
  rust: "#a8441f",
  sage: "#6d7f5c",
  mustard: "#d9a02c",
  plum: "#6b4a63",
  sky: "#4f7d8c",
  sealHi: "#92698a",
  sealLo: "#4c3346",
  woodDark: "#5d3c27",
  woodLight: "#c89a66",
  tableWhite: "#f3efe7",
  green: "#3f5c45",
};

// Font family names as registered by useFonts() in App.tsx (expo-font).
export const fonts = {
  hand: "LaBelleAurore_400Regular",
  serif: "Spectral_400Regular",
  serifItalic: "Spectral_400Regular_Italic",
  serifMedium: "Spectral_500Medium",
  serifSemiBold: "Spectral_600SemiBold",
  sans: "HankenGrotesk_400Regular",
  sansMedium: "HankenGrotesk_500Medium",
  sansSemiBold: "HankenGrotesk_600SemiBold",
};

// Per-section accent, matching lib/deskLayout.ts's SECTION_ACCENT.
export const sectionAccent: Record<string, string> = {
  know: colors.rust,
  play: colors.sky,
  look: colors.plum,
  read: colors.terracotta,
  wander: colors.sage,
  readnext: colors.mustard,
  wonder: colors.rust,
  do: colors.sage,
  quiz: "#6b4a9e",
  word: "#2d4a63",
};
