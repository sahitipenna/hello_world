import { apiDelete, apiGet, apiPost } from "./client";

export interface ShelfItem {
  contentType: string;
  contentId: string;
  title: string;
  subtitle: string;
  sourceUrl: string | null;
  createdAt: string;
}

export function fetchBookmarks(): Promise<{ items: ShelfItem[] }> {
  return apiGet(`/api/bookmarks`);
}

export function addBookmark(contentType: string, contentId: string): Promise<{ ok: boolean }> {
  return apiPost(`/api/bookmarks`, { contentType, contentId });
}

export function removeBookmark(contentType: string, contentId: string): Promise<{ ok: boolean }> {
  return apiDelete(`/api/bookmarks`, { contentType, contentId });
}
