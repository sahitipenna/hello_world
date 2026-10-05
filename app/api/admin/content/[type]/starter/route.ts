import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { getContentType } from "@/lib/adminContent";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

/** One-click "Use starter content" for a type that offers it (currently the
 * four "on the side" objects) — for a database that was never reseeded,
 * e.g. staging, which only gets `prisma migrate deploy` on each build, not
 * the seed script. Each item's `id` is the exact id prisma/seed.ts would
 * upsert it under, so this button and a full `npm run db:seed` run stay in
 * sync rather than writing two parallel copies of the same content under
 * different ids — safe to click more than once, or on a DB a reseed has
 * already touched: existing rows just get overwritten with the same text,
 * nothing duplicates. */
export async function POST(_req: Request, { params }: { params: Promise<{ type: string }> }) {
  if (!(await isAdmin())) return unauthorized();
  const { type } = await params;
  const ct = getContentType(type);
  if (!ct) return NextResponse.json({ error: "unknown content type" }, { status: 404 });
  if (!ct.starterContent) {
    return NextResponse.json({ error: "this content type has no starter content" }, { status: 400 });
  }

  const items = ct.starterContent();
  const rows = await Promise.all(
    items.map(({ id, data: itemData }) => {
      const data = { ...itemData, ...ct.fixedFields };
      return ct.delegate.upsert({ where: { id }, update: data, create: { id, ...data } });
    })
  );

  return NextResponse.json({ count: rows.length });
}
