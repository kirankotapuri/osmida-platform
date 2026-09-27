import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Multi-Subdomain Routing Middleware for Osmida
 * 
 * Supports:
 * - partner.osmida.com / parnter.osmida.com -> Rewrites to /partner (Worker Dispatch Portal)
 * - admin.osmida.com                       -> Rewrites to /admin (Operations Control Console)
 * - osmida.com / www.osmida.com            -> Customer Booking Portal
 * 
 * Also supports local development:
 * - partner.localhost:3000 -> /partner
 * - admin.localhost:3000   -> /admin
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  
  // Extract real hostname (supporting x-forwarded-host behind Vercel / Cloudflare edge proxies)
  const rawHost = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const hostname = rawHost.toLowerCase().split(":")[0];

  // Exclude static assets, Next.js internal files, images, icons, and API routes from rewrite
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/assets") ||
    url.pathname.startsWith("/icons") ||
    url.pathname.startsWith("/images") ||
    url.pathname.startsWith("/logos") ||
    url.pathname === "/sw.js" ||
    url.pathname === "/manifest.webmanifest" ||
    url.pathname === "/worker-manifest.json" ||
    url.pathname === "/manifest.json" ||
    url.pathname === "/favicon.ico" ||
    url.pathname === "/robots.txt" ||
    url.pathname === "/sitemap.xml" ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 1. WORKER / PARTNER PORTAL: partner.osmida.com or parnter.osmida.com (handling common typo) or partner.localhost
  const isPartnerDomain =
    hostname.startsWith("partner.") ||
    hostname.startsWith("parnter.") ||
    hostname === "partner.osmida.com" ||
    hostname === "parnter.osmida.com";

  if (isPartnerDomain) {
    // Route everything on partner domain to the partner SPA portal
    url.pathname = "/partner";
    return NextResponse.rewrite(url);
  }

  // 2. ADMIN OPS PORTAL: admin.osmida.com or admin.localhost
  const isAdminDomain =
    hostname.startsWith("admin.") ||
    hostname === "admin.osmida.com";

  if (isAdminDomain) {
    if (url.pathname === "/" || url.pathname === "") {
      url.pathname = "/admin";
      return NextResponse.rewrite(url);
    }
    if (!url.pathname.startsWith("/admin")) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 3. MAIN CUSTOMER PORTAL: osmida.com / www.osmida.com / localhost
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for files with extensions (e.g. .png, .jpg, .ico)
     */
    "/((?!.*\\.[\\w]+$).*)",
  ],
};
