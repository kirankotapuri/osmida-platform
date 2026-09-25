import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Multi-Subdomain Routing Middleware for Osmida
 * 
 * Supports:
 * - partner.osmida.com -> Rewrites directly to /partner (Worker Dispatch Portal)
 * - admin.osmida.com   -> Rewrites directly to /admin (Operations Control Console)
 * - osmida.com / www   -> Customer Booking Portal
 * 
 * Also supports local development:
 * - partner.localhost:3000 -> /partner
 * - admin.localhost:3000   -> /admin
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";

  // Extract hostname without port
  const hostname = host.toLowerCase().split(":")[0];

  // Exclude static assets, Next.js internal files, and API routes from rewrite
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/icons") ||
    url.pathname.startsWith("/images") ||
    url.pathname === "/sw.js" ||
    url.pathname === "/manifest.webmanifest" ||
    url.pathname === "/worker-manifest.json" ||
    url.pathname === "/favicon.ico" ||
    url.pathname === "/robots.txt" ||
    url.pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  // 1. WORKER / PARTNER PORTAL: partner.osmida.com or partner.localhost
  if (hostname.startsWith("partner.")) {
    if (url.pathname === "/" || url.pathname === "") {
      url.pathname = "/partner";
      return NextResponse.rewrite(url);
    }
    if (!url.pathname.startsWith("/partner")) {
      url.pathname = `/partner${url.pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 2. ADMIN OPS PORTAL: admin.osmida.com or admin.localhost
  if (hostname.startsWith("admin.")) {
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
