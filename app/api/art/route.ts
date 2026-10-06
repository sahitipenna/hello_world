import { NextRequest, NextResponse, after } from "next/server";
import { prisma } from "@/lib/db";
import { resolveArtFromMet } from "@/lib/metArt";

// Allow more headroom than the platform default (10s) for the handful of
// external Met Museum calls below — see the maxDuration config docs
// (https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#maxduration).
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "art";
  const seedParam = req.nextUrl.searchParams.get("seed") || q;
  const artworkId = req.nextUrl.searchParams.get("artworkId");

  const result = await resolveArtFromMet(q, seedParam);
  if (!result) {
    return NextResponse.json({ error: "unavailable" }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }

  // Cache this resolution into the Artwork row so every future request
  // for it (today or any later day it's picked again) reads straight
  // from the DB instead of re-querying the Met — only the very first
  // visitor to resolve a given artwork ever pays for the live lookup.
  // after() runs this once the response has been sent, without making
  // the visitor wait for the write, but — unlike a bare un-awaited
  // promise — Vercel keeps the function alive until it finishes instead
  // of freezing it the instant the response goes out.
  if (artworkId) {
    after(() =>
      prisma.artwork
        .update({
          where: { id: artworkId },
          data: {
            title: result.title,
            artist: result.artist,
            year: result.date,
            medium: result.medium,
            image: result.image,
            sourceUrl: result.sourceUrl,
            museum: result.credit,
          },
        })
        .catch(() => {})
    );
  }

  return NextResponse.json(result, { headers: { "Cache-Control": "private, no-store" } });
}
