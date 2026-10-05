import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { resolveArtFromMet } from "@/lib/metArt";

export const maxDuration = 30;

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

/** Resolves one Artwork row against the Met and writes the result straight
 * into its own `image` field — the same write /api/art's background cache
 * does for a real visitor, just triggered from /admin instead of waiting
 * for "first visitor pays" to happen on its own. See ContentAdmin.tsx's
 * "Warm image cache" button, which calls this once per uncached row. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;

  const row = await prisma.artwork.findUnique({ where: { id } });
  if (!row) return NextResponse.json({ error: "not found" }, { status: 404 });

  const query = row.metQuery || row.title;
  const result = await resolveArtFromMet(query, id);
  if (!result) {
    return NextResponse.json({ resolved: false });
  }

  await prisma.artwork.update({
    where: { id },
    data: {
      title: result.title,
      artist: result.artist,
      year: result.date,
      medium: result.medium,
      image: result.image,
      sourceUrl: result.sourceUrl,
      museum: result.credit,
    },
  });

  return NextResponse.json({ resolved: true });
}
