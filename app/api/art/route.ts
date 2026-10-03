import { NextRequest, NextResponse, after } from "next/server";
import { seededRandom, hashString } from "@/lib/dateUtils";
import { prisma } from "@/lib/db";

const MET_BASE = "https://collectionapi.metmuseum.org/public/collection/v1";

// Allow more headroom than the platform default (10s) for the handful of
// external Met Museum calls below — see the maxDuration config docs
// (https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#maxduration).
export const maxDuration = 30;

interface MetObject {
  objectID: number;
  title: string;
  artistDisplayName: string;
  objectDate: string;
  medium: string;
  primaryImage: string;
  primaryImageSmall: string;
  isPublicDomain: boolean;
  objectURL: string;
  creditLine: string;
}

async function fetchWithTimeout(url: string, ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal, next: { revalidate: 3600 } });
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "art";
  const seedParam = req.nextUrl.searchParams.get("seed") || q;
  const artworkId = req.nextUrl.searchParams.get("artworkId");

  try {
    const searchRes = await fetchWithTimeout(
      `${MET_BASE}/search?hasImages=true&q=${encodeURIComponent(q)}`,
      8000
    );
    if (!searchRes.ok) throw new Error("met search failed");
    const searchData: { total: number; objectIDs: number[] | null } = await searchRes.json();
    const ids = (searchData.objectIDs || []).slice(0, 20);
    if (ids.length === 0) throw new Error("no results");

    const rand = seededRandom(hashString(seedParam));
    // Try a handful of candidates in case the first pick lacks a usable
    // image — fired in parallel rather than one-at-a-time, since a
    // sequential loop of up to 6 requests at an 8s timeout each could take
    // nearly a minute in the worst case and blow past the serverless
    // function's own time budget before any individual request even times
    // out (see git history for this route — that's the "couldn't reach
    // the museum's archive" error visitors used to see).
    const order = [...ids].sort(() => rand() - 0.5).slice(0, 6);
    const candidates = await Promise.all(
      order.map(async (id) => {
        try {
          const objRes = await fetchWithTimeout(`${MET_BASE}/objects/${id}`, 8000);
          if (!objRes.ok) return null;
          const obj: MetObject = await objRes.json();
          return obj.primaryImageSmall && obj.isPublicDomain ? obj : null;
        } catch {
          return null;
        }
      })
    );
    // Preserve the seeded order so the same (query, date) pair picks the
    // same candidate every time, regardless of which requests happened to
    // resolve first.
    const obj = candidates.find((c): c is MetObject => c !== null);
    if (!obj) throw new Error("no public domain image found among candidates");

    const title = obj.title || "Untitled";
    const artist = obj.artistDisplayName || "Unknown artist";
    const credit = obj.creditLine || "The Metropolitan Museum of Art, Open Access";

    const result = {
      title,
      artist,
      date: obj.objectDate || "",
      medium: obj.medium || "",
      image: obj.primaryImageSmall,
      imageFull: obj.primaryImage,
      sourceUrl: obj.objectURL,
      credit,
    };

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
            data: { title, artist, year: result.date, medium: result.medium, image: result.image, sourceUrl: result.sourceUrl, museum: credit },
          })
          .catch(() => {})
      );
    }

    return NextResponse.json(result, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json(
      { error: "unavailable" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
