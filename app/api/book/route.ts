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

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title") || "";
  const author = req.nextUrl.searchParams.get("author") || "";

  try {
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(
      author
    )}&limit=1&fields=title,author_name,cover_i,key`;
    const res = await fetchWithTimeout(url, 6000);
    if (!res.ok) throw new Error("open library search failed");
    const data = await res.json();
    const doc = data.docs?.[0];
    if (!doc) throw new Error("no results");

    return NextResponse.json(
      {
        cover: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null,
        sourceUrl: doc.key ? `https://openlibrary.org${doc.key}` : null,
      },
      { headers: { "Cache-Control": "public, max-age=86400" } }
    );
  } catch {
    return NextResponse.json({ cover: null, sourceUrl: null }, { status: 200 });
  }
}
