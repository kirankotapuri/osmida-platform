import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

const SESSION_COOKIE_NAME = "osmida_admin_token";
const SESSION_MAX_AGE_SEC = 24 * 60 * 60; // 24 hours

function getSecretKey(): string {
  return process.env.ADMIN_SESSION_SECRET || "osmida_fallback_secret_key_prod_2026_9848";
}

// Timing-safe string comparison to protect against timing attacks
function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// Generate signed token
export function generateAdminSessionToken(username: string): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SEC * 1000;
  const payload = `${username}:${expiresAt}`;
  const hmac = crypto.createHmac("sha256", getSecretKey()).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${hmac}`;
}

// Verify signed token
export function verifyAdminSessionToken(token: string): boolean {
  try {
    const [payloadB64, hmac] = token.split(".");
    if (!payloadB64 || !hmac) return false;

    const payload = Buffer.from(payloadB64, "base64url").toString("utf8");
    const expectedHmac = crypto.createHmac("sha256", getSecretKey()).update(payload).digest("hex");
    if (!safeCompare(hmac, expectedHmac)) return false;

    const [, expiresAtStr] = payload.split(":");
    const expiresAt = Number(expiresAtStr);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

    return true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const expectedUser = process.env.ADMIN_USERNAME || "admin";
    const expectedPass = process.env.ADMIN_PASSWORD || "OsmidaOps#Nellore2026!SecureKey";

    const isUserValid = safeCompare(String(username || "").trim(), expectedUser);
    const isPassValid = safeCompare(String(password || "").trim(), expectedPass);

    if (!isUserValid || !isPassValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = generateAdminSessionToken(expectedUser);

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful",
      user: { username: expectedUser, role: "admin" },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SEC,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`));
    const token = match ? match[1] : null;

    if (!token || !verifyAdminSessionToken(token)) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, role: "admin" });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}
