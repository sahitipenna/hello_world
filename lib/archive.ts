import { toISODate } from "./dateUtils";

/** Free plan sees only the most recent FREE_ARCHIVE_DAYS days (today
 * included) — see the "last 7 days of the archive" line on /pricing.
 * Premium has no limit. Shared between the API route (server-side
 * enforcement) and the client (disabling the "previous day" nav + the
 * locked-archive gate screen). */
export const FREE_ARCHIVE_DAYS = 7;

export function freeArchiveCutoff(today: Date = new Date()): string {
  const cutoff = new Date(today);
  cutoff.setUTCDate(cutoff.getUTCDate() - (FREE_ARCHIVE_DAYS - 1));
  return toISODate(cutoff);
}

export function isWithinFreeArchive(dateISO: string, today: Date = new Date()): boolean {
  return dateISO >= freeArchiveCutoff(today);
}
