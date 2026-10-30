import { apiGet, apiPatch } from "../api/client";

export type DeskSkin = "dark" | "light" | "white" | "green";

export const DESK_SKIN_COLOR: Record<DeskSkin, string> = {
  dark: "#5d3c27",
  light: "#c89a66",
  white: "#f3efe7",
  green: "#3f5c45",
};

/** Dark-valued skins need light text over them, same split as web's
 * `deskSkin === "dark" || deskSkin === "green"` checks throughout
 * app/page.tsx. */
export function isDarkSkin(skin: DeskSkin): boolean {
  return skin === "dark" || skin === "green";
}

export interface SectionMeta {
  key: string;
  eyebrow: string;
  title: string;
  tagline: string;
  premium: boolean;
  minTimeMinutes: number;
}

export interface DeskPrefs {
  deskSkin: DeskSkin;
  sectionOrder: string[];
  hiddenSections: string[];
  // Every enabled section, regardless of today's time-budget filtering —
  // Arrange needs the full catalog to reorder/hide, not just whatever
  // made today's edition (same as web's app/page.tsx).
  allSections: SectionMeta[];
}

function normalizeSkin(skin: unknown): DeskSkin {
  return skin === "dark" || skin === "light" || skin === "white" || skin === "green" ? skin : "dark";
}

export async function fetchDeskPrefs(): Promise<DeskPrefs> {
  const d = await apiGet<{ deskSkin: string; sectionOrder: string[]; hiddenSections: string[]; allSections: SectionMeta[] }>(
    "/api/preferences"
  );
  return {
    deskSkin: normalizeSkin(d.deskSkin),
    sectionOrder: d.sectionOrder ?? [],
    hiddenSections: d.hiddenSections ?? [],
    allSections: d.allSections ?? [],
  };
}

export function saveSectionOrder(order: string[]) {
  return apiPatch("/api/preferences", { sectionOrder: order });
}

export function saveHiddenSections(hidden: string[]) {
  return apiPatch("/api/preferences", { hiddenSections: hidden });
}

export function saveDeskSkin(skin: DeskSkin) {
  return apiPatch("/api/preferences", { deskSkin: skin });
}
