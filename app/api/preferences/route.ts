import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DEFAULT_SECTION_ORDER } from "@/lib/sections";

function parseJsonArray(raw: string | null): string[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const user = await getOrCreateUser();
  return NextResponse.json(
    {
      plan: user.plan,
      sectionOrder: parseJsonArray(user.sectionOrder) ?? DEFAULT_SECTION_ORDER,
      hiddenSections: parseJsonArray(user.hiddenSections) ?? [],
    },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}

export async function PATCH(req: NextRequest) {
  const user = await getOrCreateUser();
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const data: { plan?: string; sectionOrder?: string; hiddenSections?: string } = {};

  if (body.plan === "free" || body.plan === "premium") {
    data.plan = body.plan;
  }
  if (Array.isArray(body.sectionOrder) && body.sectionOrder.every((s: unknown) => typeof s === "string")) {
    data.sectionOrder = JSON.stringify(body.sectionOrder);
  }
  if (Array.isArray(body.hiddenSections) && body.hiddenSections.every((s: unknown) => typeof s === "string")) {
    data.hiddenSections = JSON.stringify(body.hiddenSections);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "nothing to update" }, { status: 400 });
  }

  const updated = await prisma.user.update({ where: { id: user.id }, data });

  return NextResponse.json({
    plan: updated.plan,
    sectionOrder: parseJsonArray(updated.sectionOrder) ?? DEFAULT_SECTION_ORDER,
    hiddenSections: parseJsonArray(updated.hiddenSections) ?? [],
  });
}
