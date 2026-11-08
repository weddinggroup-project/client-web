import "server-only";

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { clientEnv } from "@/lib/env";
import { isSameOrigin } from "./proxy-path";
import { apiRequest } from "./server";
import { SESSION_COOKIE, sessionCookieOptions, tokenMaxAge } from "./session-cookie";
import type { User } from "./types";

export const loginSchema = z.object({
  email: z.email("Email tidak valid").max(254),
  password: z.string().min(1, "Password wajib diisi").max(72),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(120),
  email: z.email("Email tidak valid").max(254),
  password: z.string().min(6, "Password minimal 6 karakter").max(72),
});

/** Same envelope shape the Go API uses, so the browser client has one error format to parse. */
export function errorEnvelope(status: number, message: string, fields: Record<string, string> = {}) {
  const errors = Object.entries(fields).map(([field, text]) => ({ field, tag: "invalid", message: text }));
  return NextResponse.json(
    { status: "error", code: status, message, ...(errors.length ? { data: { errors } } : {}) },
    { status },
  );
}

const isHttps = () => clientEnv.NEXT_PUBLIC_APP_URL.startsWith("https://");

/**
 * Logs in or registers through the API and stores the returned JWT in an httpOnly cookie. The token is never sent
 * to the browser; only the user profile is.
 */
export async function credentialRoute(request: NextRequest, apiPath: "/auth/login" | "/auth/register", schema: z.ZodType) {
  if (!isSameOrigin(request.headers.get("origin"), request.headers.get("host"))) {
    return errorEnvelope(403, "Permintaan tidak diizinkan");
  }
  const raw: unknown = await request.json().catch(() => null);
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fields[key] ??= issue.message;
    }
    return errorEnvelope(422, "Data tidak valid", fields);
  }

  const result = await apiRequest<{ token: string; user: User }>(apiPath, {
    method: "POST",
    body: JSON.stringify(parsed.data),
    contentType: "application/json",
  });
  if (!result.ok) return errorEnvelope(result.status, result.message, result.fields);

  const response = NextResponse.json({ status: "success", code: 200, message: result.message, data: { user: result.data.user } });
  response.cookies.set(SESSION_COOKIE, result.data.token, sessionCookieOptions(tokenMaxAge(result.data.token), isHttps()));
  return response;
}

export function clearSession(request: NextRequest) {
  if (!isSameOrigin(request.headers.get("origin"), request.headers.get("host"))) {
    return errorEnvelope(403, "Permintaan tidak diizinkan");
  }
  const response = NextResponse.json({ status: "success", code: 200, message: "Anda telah keluar" });
  response.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0, isHttps()));
  return response;
}
