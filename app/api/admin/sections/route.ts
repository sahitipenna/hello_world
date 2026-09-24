import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  const sections = await prisma.section.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ sections }, { headers: { "Cache-Control": "private, no-store" } });
}

/** Body: { keys: string[] } — the whole section list, in the new display
 * order. Rewrites every row's `order` to match. */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return unauthorized();
  const body = await req.json().catch(() => null);
  const keys = Array.isArray(body?.keys) ? body.keys.filter((k: unknown) => typeof k === "string") : null;
  if (!keys) return NextResponse.json({ error: "keys must be a string[]" }, { status: 400 });

  await prisma.$transaction(keys.map((key: string, order: number) => prisma.section.update({ where: { key }, data: { order } })));

  const sections = await prisma.section.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ sections });
}
