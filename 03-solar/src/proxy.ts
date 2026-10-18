import { NextResponse, type NextRequest } from "next/server";

const locales = ["it", "en"];

// Redirect locale-less URLs to /it or /en based on the browser language (Italian by default).
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;

  const accept = request.headers.get("accept-language") ?? "";
  const locale = /^\s*en\b/i.test(accept) ? "en" : "it";
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (images, icons, sitemap, robots).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
