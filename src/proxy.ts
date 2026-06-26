import createMiddleware from "next-intl/middleware";
import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const localePattern = routing.locales.join("|");
  const dashboardPattern = new RegExp(`^/(${localePattern})/dashboard(?:/|$)`);

  if (dashboardPattern.test(request.nextUrl.pathname) && !getSessionCookie(request)) {
    const locale = request.nextUrl.pathname.split("/")[1] ?? routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/sign-in`, request.url));
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
