import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getEnabledSections } from "@/lib/sections";
import { SectionMeta } from "@/lib/types";
import { googleConfigured } from "@/lib/googleAuth";

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
  const [sections, premiumPlan] = await Promise.all([
    getEnabledSections(),
    prisma.pricingPlan.findUnique({ where: { key: "premium" } }),
  ]);
  const allSections = toSectionMeta(sections);
  const defaultOrder = allSections.map((s) => s.key);
  return NextResponse.json(
    {
      plan: user.plan,
      sectionOrder: parseJsonArray(user.sectionOrder) ?? defaultOrder,
      hiddenSections: parseJsonArray(user.hiddenSections) ?? [],
      timeBudgetMinutes: user.timeBudgetMinutes ?? null,
      deskSkin: user.deskSkin ?? "dark",
      // Every enabled section, regardless of today's time-budget filtering —
      // the customizer needs the full catalog to reorder/hide, not just
      // whatever made today's edition.
      allSections,
      // So UpgradeModal shows the real price without hardcoding it — an
      // /admin price edit takes effect there too, not just on /pricing.
      premiumPrice: premiumPlan ? { usd: premiumPlan.priceUSD, inr: premiumPlan.priceINR } : null,
      // The visitor's own opaque id (harmless to hand back — it's already
      // implied by their own cookie) — used client-side to identify this
      // visitor to analytics (see components/PostHogProvider.tsx), so
      // repeat visits are recognized as the same person.
      userId: user.id,
      user: user.email ? { email: user.email, name: user.name, image: user.image } : null,
      // Lets the client decide whether to even offer the "sign in to save"
      // prompt (components/SaveSignInPrompt.tsx) — pointing it at a
      // sign-in link that 503s because Google isn't configured on this
      // deploy would be worse than not offering it at all.
      googleConfigured: googleConfigured(),
      // Distinct calendar days this visitor has been seen on (lib/auth.ts)
      // — drives the first-visit landing gate and the delayed invitation
      // to personalize after a few visits, see app/page.tsx.
      visitCount: user.visitCount,
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

  const data: {
    plan?: string;
    sectionOrder?: string;
    hiddenSections?: string;
    timeBudgetMinutes?: number | null;
    deskSkin?: string;
  } = {};

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
  if (["dark", "light", "white"].includes(body.deskSkin)) {
    data.deskSkin = body.deskSkin;
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
    deskSkin: updated.deskSkin ?? "dark",
    allSections,
  });
}
