import { NextRequest, NextResponse } from "next/server";
import { seededRandom, hashString } from "@/lib/dateUtils";

const MET_BASE = "https://collectionapi.metmuseum.org/public/collection/v1";

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

  try {
    const searchRes = await fetchWithTimeout(
      `${MET_BASE}/search?hasImages=true&q=${encodeURIComponent(q)}`,
      6000
    );
    if (!searchRes.ok) throw new Error("met search failed");
    const searchData: { total: number; objectIDs: number[] | null } = await searchRes.json();
    const ids = (searchData.objectIDs || []).slice(0, 20);
    if (ids.length === 0) throw new Error("no results");

    const rand = seededRandom(hashString(seedParam));
    // Try a handful of candidates in case the first pick lacks a usable image.
    const order = [...ids].sort(() => rand() - 0.5);

    for (const id of order.slice(0, 6)) {
      const objRes = await fetchWithTimeout(`${MET_BASE}/objects/${id}`, 6000);
      if (!objRes.ok) continue;
      const obj: MetObject = await objRes.json();
      if (obj.primaryImageSmall && obj.isPublicDomain) {
        const title = obj.title || "Untitled";
        const artist = obj.artistDisplayName || "Unknown artist";
        const credit = obj.creditLine || "The Metropolitan Museum of Art, Open Access";

        return NextResponse.json(
          {
            title,
            artist,
            date: obj.objectDate || "",
            medium: obj.medium || "",
            image: obj.primaryImageSmall,
            imageFull: obj.primaryImage,
            sourceUrl: obj.objectURL,
            credit,
          },
          { headers: { "Cache-Control": "private, no-store" } }
        );
      }
    }
    throw new Error("no public domain image found among candidates");
  } catch {
    return NextResponse.json(
      { error: "unavailable" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
