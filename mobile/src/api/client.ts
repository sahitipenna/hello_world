// Talks to the exact same Next.js API routes the web app uses — no
// separate mobile backend. Visitor identity works the same way too: the
// server sets an httpOnly `godilly_uid` cookie (lib/auth.ts) on first
// request, and iOS's native networking stack (which fetch is built on)
// persists it in the shared cookie storage across app restarts, the same
// way Safari would. `credentials: "include"` is what makes fetch send/
// accept that cookie at all.
//
// Points at production by default since that's the one guaranteed to
// exist and have real content. Switch to your `staging` branch's Vercel
// preview URL here during development if you'd rather not write test
// data (bookmarks, quiz progress) into the production database — it's
// harmless either way (anonymous row), just a preference.
export const API_BASE = "https://www.godilly.life";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new ApiError(res.status, `GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new ApiError(res.status, `POST ${path} failed: ${res.status}`);
  return res.json();
}
