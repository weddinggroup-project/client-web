/** A same-site path to return to after sign-in. Anything that could leave the site falls back to `fallback`. */
export function safeNext(next: string | string[] | undefined, fallback = "/dashboard"): string {
  const value = Array.isArray(next) ? next[0] : next;
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || /[\u0000-\u001f]/.test(value)) {
    return fallback;
  }
  return value;
}
