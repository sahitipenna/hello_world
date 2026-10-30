import { apiGet } from "./client";

export interface ArtResolution {
  image: string;
  title: string;
  artist: string;
  date: string;
  medium: string;
  sourceUrl: string | null;
  credit: string;
}

/** Live Met Museum lookup for an Artwork row with no curated image yet —
 * mirrors components/ArtCard.tsx's client-side call on web. `artworkId`
 * lets the server cache the result into that row so only the first
 * visitor to resolve it ever pays for the live lookup. */
export function resolveArt(query: string, artworkId: string): Promise<ArtResolution> {
  return apiGet(`/api/art?q=${encodeURIComponent(query)}&seed=${encodeURIComponent(query)}&artworkId=${encodeURIComponent(artworkId)}`);
}

export interface BookCoverResolution {
  cover: string | null;
  sourceUrl: string;
}

/** Live Open Library cover lookup — mirrors components/BookRecommendation.tsx. */
export function resolveBookCover(title: string, author: string): Promise<BookCoverResolution> {
  return apiGet(`/api/book?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`);
}
