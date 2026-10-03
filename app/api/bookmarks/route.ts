import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

const ALLOWED_TYPES = ["news", "artwork", "literary", "travel", "book", "wonder"] as const;
type ContentType = (typeof ALLOWED_TYPES)[number];

function isContentType(v: unknown): v is ContentType {
  return typeof v === "string" && (ALLOWED_TYPES as readonly string[]).includes(v);
}

/** My Dilly Shelf — everything a visitor has saved, resolved with enough
 * display info to render without the client needing to know which table
 * each contentType lives in. A bookmark whose underlying row was since
 * deleted (an admin removed that piece of content) is silently dropped
 * rather than shown broken. */
export async function GET() {
  const user = await getOrCreateUser();
  const bookmarks = await prisma.bookmark.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  if (bookmarks.length === 0) {
    return NextResponse.json({ items: [] }, { headers: { "Cache-Control": "private, no-store" } });
  }

  const idsByType: Record<ContentType, string[]> = { news: [], artwork: [], literary: [], travel: [], book: [], wonder: [] };
  for (const b of bookmarks) {
    if (isContentType(b.contentType)) idsByType[b.contentType].push(b.contentId);
  }

  const [news, artwork, literary, travel, book, wonder] = await Promise.all([
    idsByType.news.length ? prisma.newsItem.findMany({ where: { id: { in: idsByType.news } } }) : [],
    idsByType.artwork.length ? prisma.artwork.findMany({ where: { id: { in: idsByType.artwork } } }) : [],
    idsByType.literary.length ? prisma.literaryItem.findMany({ where: { id: { in: idsByType.literary } } }) : [],
    idsByType.travel.length ? prisma.travelItem.findMany({ where: { id: { in: idsByType.travel } } }) : [],
    idsByType.book.length ? prisma.book.findMany({ where: { id: { in: idsByType.book } } }) : [],
    idsByType.wonder.length ? prisma.wonder.findMany({ where: { id: { in: idsByType.wonder } } }) : [],
  ]);

  const byKey = new Map<string, { title: string; subtitle: string; sourceUrl: string | null }>();
  for (const n of news) byKey.set(`news:${n.id}`, { title: n.title, subtitle: n.source, sourceUrl: n.sourceUrl });
  for (const a of artwork) byKey.set(`artwork:${a.id}`, { title: a.title, subtitle: a.artist || a.museum, sourceUrl: a.sourceUrl });
  for (const l of literary) byKey.set(`literary:${l.id}`, { title: l.work, subtitle: l.author, sourceUrl: l.sourceUrl });
  for (const t of travel) byKey.set(`travel:${t.id}`, { title: t.title, subtitle: t.location, sourceUrl: t.sourceUrl });
  for (const bk of book) byKey.set(`book:${bk.id}`, { title: bk.title, subtitle: bk.author, sourceUrl: null });
  for (const w of wonder) byKey.set(`wonder:${w.id}`, { title: w.title, subtitle: w.source, sourceUrl: null });

  const items = bookmarks
    .map((b) => {
      const info = byKey.get(`${b.contentType}:${b.contentId}`);
      if (!info) return null;
      return { contentType: b.contentType, contentId: b.contentId, createdAt: b.createdAt, ...info };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return NextResponse.json({ items }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(req: NextRequest) {
  const user = await getOrCreateUser();
  const body = await req.json().catch(() => null);
  const contentType = body?.contentType;
  const contentId = body?.contentId;
  if (!isContentType(contentType) || typeof contentId !== "string" || !contentId) {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }
  await prisma.bookmark.upsert({
    where: { userId_contentType_contentId: { userId: user.id, contentType, contentId } },
    update: {},
    create: { userId: user.id, contentType, contentId },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getOrCreateUser();
  const body = await req.json().catch(() => null);
  const contentType = body?.contentType;
  const contentId = body?.contentId;
  if (!isContentType(contentType) || typeof contentId !== "string" || !contentId) {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }
  await prisma.bookmark.deleteMany({ where: { userId: user.id, contentType, contentId } });
  return NextResponse.json({ ok: true });
}
