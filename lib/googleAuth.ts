import { randomBytes } from "crypto";
import { prisma } from "./db";
import { mergeUserInto } from "./userMerge";
import { setUserCookie } from "./auth";

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const USERINFO_ENDPOINT = "https://www.googleapis.com/oauth2/v3/userinfo";
const TOKENINFO_ENDPOINT = "https://oauth2.googleapis.com/tokeninfo";

export function googleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

/** The iOS app's own OAuth client (type "iOS", no secret — a public
 * native client, separate from the web client above) — set up once in
 * Google Cloud Console for this app's bundle id, see mobile/README.md. */
export function mobileGoogleConfigured() {
  return Boolean(process.env.GOOGLE_IOS_CLIENT_ID);
}

export function generateState() {
  return randomBytes(16).toString("hex");
}

/** origin: the app's own origin (e.g. https://www.godilly.life or
 * http://localhost:3000), computed from the incoming request so the
 * redirect_uri is automatically correct in both dev and production —
 * both must be added as "Authorized redirect URIs" in the Google Cloud
 * Console OAuth client. */
export function redirectUri(origin: string) {
  return `${origin}/api/auth/google/callback`;
}

export function buildAuthorizeUrl(origin: string, state: string) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri(origin),
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });
  return `${AUTH_ENDPOINT}?${params.toString()}`;
}

export interface GoogleProfile {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
}

/** Exchanges an authorization code for the visitor's Google profile.
 * Calls the userinfo endpoint with the access token rather than decoding
 * the id_token JWT ourselves — one extra request, but no JWT-signature
 * verification code to get right. */
export async function fetchGoogleProfile(code: string, origin: string): Promise<GoogleProfile> {
  const tokenRes = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      redirect_uri: redirectUri(origin),
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) throw new Error(`Google token exchange failed: ${tokenRes.status}`);
  const { access_token } = await tokenRes.json();

  const profileRes = await fetch(USERINFO_ENDPOINT, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!profileRes.ok) throw new Error(`Google userinfo fetch failed: ${profileRes.status}`);
  return profileRes.json();
}

/** Verifies an ID token the mobile app got directly from Google (native
 * sign-in, no server round-trip for the OAuth dance itself — see
 * app/api/auth/google/mobile/route.ts) and returns the same profile
 * shape the web flow's code-exchange produces. Uses Google's tokeninfo
 * endpoint rather than verifying the JWT signature ourselves, same
 * simplicity tradeoff as fetchGoogleProfile's comment above — this
 * endpoint validates signature/expiry server-side on Google's end, we
 * just have to additionally check the audience ourselves. */
export async function verifyMobileIdToken(idToken: string): Promise<GoogleProfile> {
  const res = await fetch(`${TOKENINFO_ENDPOINT}?id_token=${encodeURIComponent(idToken)}`);
  if (!res.ok) throw new Error(`Google tokeninfo fetch failed: ${res.status}`);
  const claims = await res.json();
  if (claims.aud !== process.env.GOOGLE_IOS_CLIENT_ID) {
    throw new Error("ID token was not issued for this app");
  }
  return {
    sub: claims.sub,
    email: claims.email,
    email_verified: claims.email_verified === "true" || claims.email_verified === true,
    name: claims.name,
    picture: claims.picture,
  };
}

/** The actual "attach this Google identity to a visitor" logic, shared
 * by the web redirect callback and the mobile JSON endpoint — only how
 * each gets the verified GoogleProfile, and how each responds afterward
 * (a redirect vs. a JSON body), differs between them. Switches this
 * request's identity cookie to the resulting row itself when it
 * changed, so neither caller needs its own cookies()-handling copy of
 * that logic; returns the final user id either way. */
export async function linkGoogleProfile(currentUserId: string, profile: GoogleProfile): Promise<string> {
  if (!profile.email) throw new Error("Google profile has no email");

  const existing = await prisma.user.findUnique({ where: { googleId: profile.sub } });

  if (existing && existing.id !== currentUserId) {
    await mergeUserInto(currentUserId, existing.id);
    await setUserCookie(existing.id);
    return existing.id;
  }
  if (!existing) {
    try {
      await prisma.user.update({
        where: { id: currentUserId },
        data: { googleId: profile.sub, email: profile.email, name: profile.name ?? null, image: profile.picture ?? null },
      });
    } catch {
      // Race: another request linked this googleId/email between our
      // check and this write. Fall back to whichever row now holds it.
      const winner = await prisma.user.findUnique({ where: { googleId: profile.sub } });
      if (winner && winner.id !== currentUserId) {
        await mergeUserInto(currentUserId, winner.id);
        await setUserCookie(winner.id);
        return winner.id;
      }
    }
  }
  return currentUserId;
}
