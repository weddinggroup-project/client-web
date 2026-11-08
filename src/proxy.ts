import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/vowly/session-cookie";

/**
 * Sends visitors without a session cookie to the sign-in page. This is only a fast first gate: the cookie's validity
 * is checked against the API in the server layouts (requireSession), and the API enforces access on every call.
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const url = request.nextUrl.clone();
  const next = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  url.pathname = "/sign-in";
  url.search = `?next=${encodeURIComponent(next)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*", "/undangan-digital/pesan/:path*", "/kolaborasi/:path*"],
};
