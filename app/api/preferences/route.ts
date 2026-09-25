import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getEnabledSections } from "@/lib/sections";
import { SectionMeta } from "@/lib/types";

function parseJsonArray(raw: string | null): string[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function toSectionMeta(rows: Awaited<ReturnType<typeof getEnabledSections>>): SectionMeta[] {
  return rows.map((s) => ({
    key: s.key,
    eyebrow: s.eyebrow,
    title: s.title,
    tagline: s.tagline,
    premium: s.premium,
    minTimeMinutes: s.minTimeMinutes,
  }));
}

export async function GET() {
  const user = await getOrCreateUser();
  const allSections = toSectionMeta(await getEnabledSections());
  const defaultOrder = allSections.map((s) => s.key);
  return NextResponse.json(
    {
      plan: user.plan,
      sectionOrder: parseJsonArray(user.sectionOrder) ?? defaultOrder,
      hiddenSections: parseJsonArray(user.hiddenSections) ?? [],
      timeBudgetMinutes: user.timeBudgetMinutes ?? null,
      // Every enabled section, regardless of today's time-budget filtering —
      // the customizer needs the full catalog to reorder/hide, not just
      // whatever made today's edition.
      allSections,
    },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}

const VALID_TIME_BUDGETS = [5, 15, 30, 45];

export async function PATCH(req: NextRequest) {
  const user = await getOrCreateUser();
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const data: { plan?: string; sectionOrder?: string; hiddenSections?: string; timeBudgetMinutes?: number | null } = {};

  if (body.plan === "free" || body.plan === "premium") {
    data.plan = body.plan;
  }
  if (Array.isArray(body.sectionOrder) && body.sectionOrder.every((s: unknown) => typeof s === "string")) {
    data.sectionOrder = JSON.stringify(body.sectionOrder);
  }
  if (Array.isArray(body.hiddenSections) && body.hiddenSections.every((s: unknown) => typeof s === "string")) {
    data.hiddenSections = JSON.stringify(body.hiddenSections);
  }
  if (body.timeBudgetMinutes === null || VALID_TIME_BUDGETS.includes(body.timeBudgetMinutes)) {
    data.timeBudgetMinutes = body.timeBudgetMinutes;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "nothing to update" }, { status: 400 });
  }

  const updated = await prisma.user.update({ where: { id: user.id }, data });
  const allSections = toSectionMeta(await getEnabledSections());
  const defaultOrder = allSections.map((s) => s.key);

  return NextResponse.json({
    plan: updated.plan,
    sectionOrder: parseJsonArray(updated.sectionOrder) ?? defaultOrder,
    hiddenSections: parseJsonArray(updated.hiddenSections) ?? [],
    timeBudgetMinutes: updated.timeBudgetMinutes ?? null,
    allSections,
  });
}
