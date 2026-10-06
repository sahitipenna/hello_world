import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { prisma } from "./db";
import { toISODate } from "./dateUtils";

export const COOKIE_NAME = "godilly_uid";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 365 * 2,
  path: "/",
};

/** Points this browser's identity cookie at a specific user id — used by
 * the Google sign-in callback when a visitor's Google account is already
 * linked to a different (older) row than their current anonymous one, so
 * signing in reunites them with their established account instead of
 * leaving two rows around. */
export async function setUserCookie(id: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, id, cookieOptions);
}

export async function clearUserCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

/**
 * Anonymous, per-browser identity: a random id in an httpOnly cookie,
 * mirrored as a User row. No email/password yet — real accounts (and
 * cross-device sync) are the natural next step, noted in the README.
 * Only callable from Route Handlers / Server Actions (cookies() is
 * read-only during Server Component render).
 */
export async function getOrCreateUser() {
  const jar = await cookies();
  let uid = jar.get(COOKIE_NAME)?.value;

  if (!uid) {
    uid = randomUUID();
    jar.set(COOKIE_NAME, uid, cookieOptions);
  }

  const now = new Date();
  // visitCount counts distinct calendar days, not requests — check whether
  // today is a new day for this visitor BEFORE overwriting lastSeenAt below.
  const existing = await prisma.user.findUnique({ where: { id: uid }, select: { lastSeenAt: true } });
  const isNewDay = !existing || toISODate(existing.lastSeenAt) !== toISODate(now);

  return prisma.user.upsert({
    where: { id: uid },
    update: { lastSeenAt: now, ...(isNewDay ? { visitCount: { increment: 1 } } : {}) },
    create: { id: uid, lastSeenAt: now, visitCount: 1 },
  });
}
