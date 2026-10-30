import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getOrCreateUser } from "@/lib/auth";
import { fetchGoogleProfile, linkGoogleProfile } from "@/lib/googleAuth";

const STATE_COOKIE = "godilly_oauth_state";

/** Completes Google sign-in. Attaches the Google profile to the visitor's
 * CURRENT anonymous row (so their existing interests/todos/plan carry over
 * automatically — no data migration needed, it's the same row) UNLESS that
 * Google account is already linked to a different, older row (a previous
 * device/browser), in which case this browser's identity cookie switches
 * to that established row instead — standard "log in" behavior. See
 * lib/googleAuth.ts's linkGoogleProfile for the actual merge logic, shared
 * with the mobile app's equivalent endpoint. */
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

  const currentUser = await getOrCreateUser();
  try {
    await linkGoogleProfile(currentUser.id, profile);
  } catch {
    return NextResponse.redirect(new URL("/?auth_error=1", req.nextUrl.origin));
  }

  return NextResponse.redirect(home);
}
