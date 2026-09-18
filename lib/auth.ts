import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { prisma } from "./db";

const COOKIE_NAME = "daybook_uid";

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
    jar.set(COOKIE_NAME, uid, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365 * 2,
      path: "/",
    });
  }

  return prisma.user.upsert({
    where: { id: uid },
    update: {},
    create: { id: uid },
  });
}
