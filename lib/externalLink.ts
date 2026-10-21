/**
 * A guaranteed-useful "find out more" link for saved content, used by
 * app/api/bookmarks (My Dilly Shelf) for any item that has no curated
 * sourceUrl of its own. Nearly all of this app's content is original
 * editorial writing or public-domain excerpts (see lib/contentBank.ts,
 * prisma/seed.ts) with no single canonical source page — hand-entering a
 * specific URL per item (there are ~150) would mean either guessing at
 * exact article URLs (real risk of a dead link) or leaving most items
 * with nothing. A search URL never 404s: it always resolves to either the
 * real page or an honest "no results," so it's the safe default. Book is
 * the one case with an established, more useful destination (Goodreads,
 * not Wikipedia — see app/api/book/route.ts, which this mirrors).
 */
export function wikipediaSearchUrl(query: string): string {
  return `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`;
}

export function goodreadsSearchUrl(title: string, author: string): string {
  return `https://www.goodreads.com/search?q=${encodeURIComponent(`${title} ${author}`.trim())}`;
}
