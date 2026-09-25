import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getOrCreateUser, setUserCookie } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { fetchGoogleProfile } from "@/lib/googleAuth";

const STATE_COOKIE = "godilly_oauth_state";

/** Completes Google sign-in. Attaches the Google profile to the visitor's
 * CURRENT anonymous row (so their existing interests/todos/plan carry over
 * automatically — no data migration needed, it's the same row) UNLESS that
 * Google account is already linked to a different, older row (a previous
 * device/browser), in which case this browser's identity cookie switches
 * to that established row instead — standard "log in" behavior. */
export async function GET(req: NextRequest) {
  const home = new URL("/", req.nextUrl.origin);

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const jar = await cookies();
  const expectedState = jar.get(STATE_COOKIE)?.value;
  jar.delete(STATE_COOKIE);

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/?auth_error=1", req.nextUrl.origin));
  }

  let profile;
  try {
    profile = await fetchGoogleProfile(code, req.nextUrl.origin);
  } catch {
    return NextResponse.redirect(new URL("/?auth_error=1", req.nextUrl.origin));
  }
  if (!profile.email) {
    return NextResponse.redirect(new URL("/?auth_error=1", req.nextUrl.origin));
  }

  const currentUser = await getOrCreateUser();

  const existing = await prisma.user.findUnique({ where: { googleId: profile.sub } });

  if (existing && existing.id !== currentUser.id) {
    // This Google account already belongs to an established row (signing
    // in on a new device, or after clearing cookies) — reunite with it.
    await setUserCookie(existing.id);
  } else if (!existing) {
    try {
      await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          googleId: profile.sub,
          email: profile.email,
          name: profile.name ?? null,
          image: profile.picture ?? null,
        },
      });
    } catch {
      // Race: another request linked this googleId/email between our
      // check and this write. Fall back to whichever row now holds it.
      const winner = await prisma.user.findUnique({ where: { googleId: profile.sub } });
      if (winner && winner.id !== currentUser.id) await setUserCookie(winner.id);
    }
  }
  // else: existing.id === currentUser.id — already linked, nothing to do.

  return NextResponse.redirect(home);
}
