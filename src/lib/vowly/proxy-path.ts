/**
 * Which API paths the browser may reach through /api/backend/*. The proxy forwards the session token, so it must not
 * become an open relay: only plain path segments, and never the credential endpoints (handled by /api/session/*),
 * the admin area, or the payment webhook.
 */
const SEGMENT = /^[A-Za-z0-9._-]+$/;
const BLOCKED_PREFIXES = ["auth/login", "auth/register", "admin", "webhooks"];

/** Plain, bounded path segments only: no dots-only segments, encodings, or separators. */
export function hasSafeSegments(segments: string[]): boolean {
  if (segments.length === 0 || segments.length > 8) return false;
  return segments.every((segment) => SEGMENT.test(segment) && segment !== "." && segment !== "..");
}

export function isAllowedBackendPath(segments: string[]): boolean {
  if (!hasSafeSegments(segments)) return false;
  const joined = segments.join("/").toLowerCase();
  return !BLOCKED_PREFIXES.some((prefix) => joined === prefix || joined.startsWith(`${prefix}/`));
}

/** Rejects cross-site state-changing requests: when an Origin header is present it must match the app's own host. */
export function isSameOrigin(origin: string | null, host: string | null): boolean {
  if (!origin) return true; // same-origin GETs and non-browser clients send no Origin; SameSite=Lax covers the rest
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
