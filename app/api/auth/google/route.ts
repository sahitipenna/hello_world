import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { buildAuthorizeUrl, generateState, googleConfigured } from "@/lib/googleAuth";

const STATE_COOKIE = "godilly_oauth_state";

/** Starts Google sign-in: stash a random state (CSRF check for the
 * callback) in a short-lived cookie, then redirect to Google's consent
 * screen. The visitor's existing anonymous identity cookie is untouched —
 * the callback attaches Google's profile to that same row. */
export async function GET(req: NextRequest) {
  if (!googleConfigured()) {
    return NextResponse.json({ error: "Google sign-in isn't configured yet" }, { status: 503 });
  }

  const state = generateState();
  const jar = await cookies();
  jar.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    path: "/",
  });

  const origin = req.nextUrl.origin;
  return NextResponse.redirect(buildAuthorizeUrl(origin, state));
}
