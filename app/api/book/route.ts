import { NextRequest, NextResponse } from "next/server";

async function fetchWithTimeout(url: string, ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal, next: { revalidate: 86400 } });
  } finally {
    clearTimeout(timer);
  }
}

/** Open Library only supplies the cover art (it has a free, keyless covers
 * API with no equivalent on Goodreads); the "find it" link itself points to
 * a Goodreads search, since that's where readers actually go to save a book
 * or read reviews. */
export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title") || "";
  const author = req.nextUrl.searchParams.get("author") || "";
  const goodreadsUrl = `https://www.goodreads.com/search?q=${encodeURIComponent(`${title} ${author}`.trim())}`;

  try {
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(
      author
    )}&limit=1&fields=title,author_name,cover_i`;
    const res = await fetchWithTimeout(url, 6000);
    if (!res.ok) throw new Error("open library search failed");
    const data = await res.json();
    const doc = data.docs?.[0];

    return NextResponse.json(
      {
        cover: doc?.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null,
        sourceUrl: goodreadsUrl,
      },
      { headers: { "Cache-Control": "public, max-age=86400" } }
    );
  } catch {
    return NextResponse.json({ cover: null, sourceUrl: goodreadsUrl }, { status: 200 });
  }
}
