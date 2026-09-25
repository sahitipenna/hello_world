import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getEnabledSections } from "@/lib/sections";
import { computeDefaultHidden, getSectionCategories } from "@/lib/sectionInterests";

/** Explicit "reset to suggested" action from Customize: recomputes
 * hiddenSections from the visitor's current interests and overwrites
 * whatever they'd set manually. Unlike /api/interests PUT (which only sets
 * a default the first time interests are ever saved), this always runs and
 * is only ever triggered by that one button — interest changes alone never
 * call this. */
export async function POST() {
  const user = await getOrCreateUser();
  const [selected, sections, categoriesByKey] = await Promise.all([
    prisma.userInterest.findMany({ where: { userId: user.id }, include: { tag: true } }),
    getEnabledSections(),
    getSectionCategories(),
  ]);

  const hiddenSections = computeDefaultHidden(
    sections.map((s) => s.key),
    categoriesByKey,
    selected.map((s) => s.tag.slug)
  );

  await prisma.user.update({ where: { id: user.id }, data: { hiddenSections: JSON.stringify(hiddenSections) } });

  return NextResponse.json({ ok: true, hiddenSections });
}
