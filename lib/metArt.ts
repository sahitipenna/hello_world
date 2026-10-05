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

export interface ResolvedArt {
  title: string;
  artist: string;
  date: string;
  medium: string;
  image: string;
  imageFull: string;
  sourceUrl: string;
  credit: string;
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

/** The single live Met lookup both /api/art (one visitor, one artwork, on
 * demand) and the admin "warm image cache" action (many artworks, ahead of
 * time) share — kept in one place so a reliability fix here covers both
 * call sites instead of drifting apart. Returns null rather than throwing
 * on any failure (bad search, no public-domain candidate, timeout) — every
 * caller treats "couldn't resolve" as an ordinary outcome, not an error. */
export async function resolveArtFromMet(query: string, seedParam: string): Promise<ResolvedArt | null> {
  try {
    const searchRes = await fetchWithTimeout(`${MET_BASE}/search?hasImages=true&q=${encodeURIComponent(query)}`, 8000);
    if (!searchRes.ok) return null;
    const searchData: { total: number; objectIDs: number[] | null } = await searchRes.json();
    const ids = (searchData.objectIDs || []).slice(0, 20);
    if (ids.length === 0) return null;

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
    // Preserve the seeded order so the same (query, seed) pair picks the
    // same candidate every time, regardless of which requests happened to
    // resolve first.
    const obj = candidates.find((c): c is MetObject => c !== null);
    if (!obj) return null;

    return {
      title: obj.title || "Untitled",
      artist: obj.artistDisplayName || "Unknown artist",
      date: obj.objectDate || "",
      medium: obj.medium || "",
      image: obj.primaryImageSmall,
      imageFull: obj.primaryImage,
      sourceUrl: obj.objectURL,
      credit: obj.creditLine || "The Metropolitan Museum of Art, Open Access",
    };
  } catch {
    return null;
  }
}
