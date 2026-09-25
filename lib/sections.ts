import { prisma } from "./db";

/** All enabled sections, in display order — the single source of truth the
 * daily edition, the customizer, and the default section order all read
 * from. Adding, renaming, reordering, or re-pricing a section is a row
 * edit via /admin, not a code change. */
export async function getEnabledSections() {
  return prisma.section.findMany({ where: { enabled: true }, orderBy: { order: "asc" } });
}
