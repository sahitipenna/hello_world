import { cookies } from "next/headers";

const COOKIE_NAME = "godilly_admin";

/** Shared-secret gate for /admin (see ARCHITECTURE.md §1/§4). No user
 * accounts involved — a single secret, set via the ADMIN_SECRET env var,
 * unlocks the content management interface for whoever has it. */
export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(COOKIE_NAME)?.value === "1";
}

export async function setAdminCookie() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
