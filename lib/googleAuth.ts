import { randomBytes } from "crypto";

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const USERINFO_ENDPOINT = "https://www.googleapis.com/oauth2/v3/userinfo";

export function googleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
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
