import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

export const SESSION_COOKIE_NAME = "admin_session_token";

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "portfolio-secure-admin-secret-key-2026";

// 7 days in milliseconds
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function computeHmacSha256(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Generate a cryptographically signed HMAC-SHA256 session token
 */
export async function generateSessionToken(email: string): Promise<string> {
  const timestamp = Date.now().toString();
  const payload = `${email}:${timestamp}`;
  const signature = await computeHmacSha256(payload);
  const encodedPayload = toBase64Url(payload);
  return `${encodedPayload}.${signature}`;
}

/**
 * Verify HMAC signature and timestamp of session token
 */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<{ valid: boolean; email?: string }> {
  if (!token || typeof token !== "string") {
    return { valid: false };
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return { valid: false };

    const [encodedPayload, signature] = parts;
    if (!encodedPayload || !signature) return { valid: false };

    const payload = fromBase64Url(encodedPayload);
    const [email, timestampStr] = payload.split(":");
    if (!email || !timestampStr) return { valid: false };

    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return { valid: false };

    // Check expiration
    if (Date.now() - timestamp > SESSION_MAX_AGE_MS || timestamp > Date.now() + 60000) {
      return { valid: false };
    }

    // Verify cryptographic signature
    const expectedHmac = await computeHmacSha256(payload);
    if (signature.length !== expectedHmac.length || signature !== expectedHmac) {
      return { valid: false };
    }

    return { valid: true, email };
  } catch {
    return { valid: false };
  }
}

/**
 * Set the secure admin session cookie (Server Action / Route Handler)
 */
export async function setAdminSession(email: string) {
  const token = await generateSessionToken(email);
  const cookieStore = await cookies();

  // Set the cryptographically signed token
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // Remove any legacy insecure demo cookie
  cookieStore.delete("demo_admin_session");
}

/**
 * Clear all admin session cookies (Logout)
 */
export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete("demo_admin_session");
}

/**
 * Check if the request in middleware has a valid admin session
 */
export async function isRequestAdminAuthenticated(request: NextRequest): Promise<{
  authenticated: boolean;
  email?: string;
}> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const verification = await verifySessionToken(token);
  return {
    authenticated: verification.valid,
    email: verification.email,
  };
}

/**
 * Check if current server component context has a valid admin session
 */
export async function getServerAdminSession(): Promise<{
  authenticated: boolean;
  email?: string;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const verification = await verifySessionToken(token);
  return {
    authenticated: verification.valid,
    email: verification.email,
  };
}
