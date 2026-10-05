import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { SIDE_OBJECT_ACCENT, SIDE_OBJECT_META_FALLBACK } from "@/lib/deskLayout";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ pool: string }> }) {
  if (!(await isAdmin())) return unauthorized();
  const { pool } = await params;
  if (!(pool in SIDE_OBJECT_ACCENT)) {
    return NextResponse.json({ error: "unknown pool" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const data: Record<string, string> = {};
  if (typeof body.label === "string") data.label = body.label.trim();
  if (typeof body.description === "string") data.description = body.description.trim();
  if (Object.keys(data).length === 0) return NextResponse.json({ error: "nothing to update" }, { status: 400 });

  const fallback = SIDE_OBJECT_META_FALLBACK[pool];
  const meta = await prisma.sideObjectMeta.upsert({
    where: { pool },
    update: data,
    create: { pool, label: fallback.label, description: fallback.description, ...data },
  });

  return NextResponse.json({ meta });
}
