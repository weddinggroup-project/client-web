/** Name of the httpOnly cookie that carries the API's JWT. The browser never reads it. */
export const SESSION_COOKIE = "vowly_token";

const DEFAULT_MAX_AGE_SECONDS = 24 * 60 * 60;

/** Seconds until the JWT expires (from its `exp` claim), falling back to 24 hours when it cannot be read. */
export function tokenMaxAge(token: string, nowSeconds = Math.floor(Date.now() / 1000)): number {
  try {
    const payload = token.split(".")[1];
    if (!payload) return DEFAULT_MAX_AGE_SECONDS;
    const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: unknown };
    if (typeof json.exp !== "number") return DEFAULT_MAX_AGE_SECONDS;
    return Math.max(0, json.exp - nowSeconds);
  } catch {
    return DEFAULT_MAX_AGE_SECONDS;
  }
}

export function sessionCookieOptions(maxAge: number, secure: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge,
  };
}
