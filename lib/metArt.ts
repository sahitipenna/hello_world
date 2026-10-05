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

export interface ResolveOutcome {
  result: ResolvedArt | null;
  // A one-line, human-readable account of what actually happened — which
  // step failed and how. Nothing downstream needs this for normal
  // operation (a null `result` is all /api/art and the warm-cache loop act
  // on), but it's the only way to tell "Met is down", "Met is blocking
  // this network", and "this query has no public-domain images" apart
  // from one another instead of all three collapsing into the same
  // generic failure.
  diagnostic: string;
}

function describeFetchError(e: unknown): string {
  if (e instanceof DOMException && e.name === "AbortError") return "timed out";
  if (e instanceof Error) return e.message || e.name;
  return String(e);
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
 * call sites instead of drifting apart. */
export async function resolveArtFromMetWithDiagnostic(query: string, seedParam: string): Promise<ResolveOutcome> {
  let searchRes: Response;
  try {
    searchRes = await fetchWithTimeout(`${MET_BASE}/search?hasImages=true&q=${encodeURIComponent(query)}`, 8000);
  } catch (e) {
    return { result: null, diagnostic: `search request failed: ${describeFetchError(e)}` };
  }
  if (!searchRes.ok) {
    return { result: null, diagnostic: `search returned HTTP ${searchRes.status}` };
  }

  let searchData: { total: number; objectIDs: number[] | null };
  try {
    searchData = await searchRes.json();
  } catch (e) {
    return { result: null, diagnostic: `search response wasn't valid JSON: ${describeFetchError(e)}` };
  }
  const ids = (searchData.objectIDs || []).slice(0, 20);
  if (ids.length === 0) {
    return { result: null, diagnostic: `search for "${query}" returned zero results` };
  }

  const rand = seededRandom(hashString(seedParam));
  // Try a handful of candidates in case the first pick lacks a usable
  // image — fired in parallel rather than one-at-a-time, since a
  // sequential loop of up to 6 requests at an 8s timeout each could take
  // nearly a minute in the worst case and blow past the serverless
  // function's own time budget before any individual request even times
  // out (see git history for this route — that's the "couldn't reach the
  // museum's archive" error visitors used to see).
  const order = [...ids].sort(() => rand() - 0.5).slice(0, 6);
  const outcomes: string[] = [];
  const candidates = await Promise.all(
    order.map(async (id) => {
      try {
        const objRes = await fetchWithTimeout(`${MET_BASE}/objects/${id}`, 8000);
        if (!objRes.ok) {
          outcomes.push(`#${id}: HTTP ${objRes.status}`);
          return null;
        }
        const obj: MetObject = await objRes.json();
        if (obj.primaryImageSmall && obj.isPublicDomain) return obj;
        outcomes.push(`#${id}: ${obj.isPublicDomain ? "no image" : "not public domain"}`);
        return null;
      } catch (e) {
        outcomes.push(`#${id}: ${describeFetchError(e)}`);
        return null;
      }
    })
  );
  // Preserve the seeded order so the same (query, seed) pair picks the
  // same candidate every time, regardless of which requests happened to
  // resolve first.
  const obj = candidates.find((c): c is MetObject => c !== null);
  if (!obj) {
    return { result: null, diagnostic: `none of ${order.length} candidates usable (${outcomes.join("; ")})` };
  }

  return {
    result: {
      title: obj.title || "Untitled",
      artist: obj.artistDisplayName || "Unknown artist",
      date: obj.objectDate || "",
      medium: obj.medium || "",
      image: obj.primaryImageSmall,
      imageFull: obj.primaryImage,
      sourceUrl: obj.objectURL,
      credit: obj.creditLine || "The Metropolitan Museum of Art, Open Access",
    },
    diagnostic: "ok",
  };
}

/** Same lookup, for the callers that only ever act on success/failure and
 * have no use for the diagnostic string (today, just /api/art — a visitor
 * either sees an artwork or the generic "try again" message either way). */
export async function resolveArtFromMet(query: string, seedParam: string): Promise<ResolvedArt | null> {
  const { result } = await resolveArtFromMetWithDiagnostic(query, seedParam);
  return result;
}
