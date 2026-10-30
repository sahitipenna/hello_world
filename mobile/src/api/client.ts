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

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new ApiError(res.status, `${method} ${path} failed: ${res.status}`);
  return res.json();
}

export const apiGet = <T>(path: string) => request<T>("GET", path);
export const apiPost = <T>(path: string, body?: unknown) => request<T>("POST", path, body);
export const apiPatch = <T>(path: string, body?: unknown) => request<T>("PATCH", path, body);
export const apiPut = <T>(path: string, body?: unknown) => request<T>("PUT", path, body);
export const apiDelete = <T>(path: string, body?: unknown) => request<T>("DELETE", path, body);
