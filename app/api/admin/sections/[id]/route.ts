import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const data: Record<string, string | number | boolean | null> = {};
  if (typeof body.eyebrow === "string") data.eyebrow = body.eyebrow.trim();
  if (typeof body.title === "string") data.title = body.title.trim();
  if (typeof body.tagline === "string") data.tagline = body.tagline.trim();
  if (typeof body.premium === "boolean") data.premium = body.premium;
  if (typeof body.enabled === "boolean") data.enabled = body.enabled;
  if (typeof body.minTimeMinutes === "number") data.minTimeMinutes = body.minTimeMinutes;
  if (body.freeCount === null || typeof body.freeCount === "number") data.freeCount = body.freeCount;

  if (Object.keys(data).length === 0) return NextResponse.json({ error: "nothing to update" }, { status: 400 });

  const section = await prisma.section.update({ where: { id }, data });
  return NextResponse.json({ section });
}
