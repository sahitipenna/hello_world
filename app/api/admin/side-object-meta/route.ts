import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { SIDE_OBJECT_ACCENT, SIDE_OBJECT_META_FALLBACK } from "@/lib/deskLayout";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

/** Always returns exactly the 4 known pools, filling in the fallback
 * label/description (see lib/deskLayout.ts) for any pool that has no
 * SideObjectMeta row yet — so the Sections tab shows something sensible
 * to edit even before the first save, rather than 4 blank forms. */
export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  const pools = Object.keys(SIDE_OBJECT_ACCENT);
  const rows = await prisma.sideObjectMeta.findMany({ where: { pool: { in: pools } } });
  const byPool = new Map(rows.map((r) => [r.pool, r]));

  const meta = pools.map((pool) => {
    const row = byPool.get(pool);
    const fallback = SIDE_OBJECT_META_FALLBACK[pool];
    return {
      pool,
      label: row?.label ?? fallback.label,
      description: row?.description ?? fallback.description,
    };
  });

  return NextResponse.json({ meta }, { headers: { "Cache-Control": "private, no-store" } });
}
