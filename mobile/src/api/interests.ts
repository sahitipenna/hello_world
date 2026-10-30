import { apiGet, apiPatch, apiPut } from "./client";

export interface Tag {
  id: string;
  slug: string;
  label: string;
  emoji: string;
}

export interface InterestsResponse {
  tags: Tag[];
  selected: string[];
  hasChosen: boolean;
}

export function fetchInterests(): Promise<InterestsResponse> {
  return apiGet(`/api/interests`);
}

export function saveInterests(slugs: string[]): Promise<{ ok: boolean; selected: string[]; hiddenSections: string[] | null }> {
  return apiPut(`/api/interests`, { slugs });
}

export interface PreferencesResponse {
  plan: "free" | "premium";
  timeBudgetMinutes: number | null;
}

export function fetchPreferences(): Promise<PreferencesResponse> {
  return apiGet(`/api/preferences`);
}

export function updateTimeBudget(timeBudgetMinutes: number | null): Promise<PreferencesResponse> {
  return apiPatch(`/api/preferences`, { timeBudgetMinutes });
}
