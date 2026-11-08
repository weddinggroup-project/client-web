import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverEnv } from "@/lib/env";
import { SESSION_COOKIE } from "./session-cookie";
import type { Envelope, FieldError, PageMeta, User } from "./types";

const TIMEOUT_MS = 10_000;

export type ApiResult<T> =
  | { ok: true; status: number; data: T; meta?: PageMeta; message: string }
  | { ok: false; status: number; message: string; fields: Record<string, string> };

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  token?: string;
  body?: BodyInit | null;
  contentType?: string;
  query?: Record<string, string | number | undefined>;
};

export function fieldsFromEnvelope(envelope: Envelope<unknown> | null): Record<string, string> {
  const data = envelope?.data as { errors?: FieldError[] } | undefined;
  const fields: Record<string, string> = {};
  for (const item of data?.errors ?? []) fields[item.field] = item.message;
  return fields;
}

/**
 * Calls the Vowly API from the server. Network failures and non-JSON replies become a failed ApiResult instead of
 * throwing, so callers always handle one shape.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
  const url = new URL(`/api/v1${path}`, serverEnv.API_BASE_URL);
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  if (options.contentType) headers["Content-Type"] = options.contentType;

  try {
    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers,
      body: options.body ?? undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const envelope = (await response.json().catch(() => null)) as Envelope<T> | null;
    if (!response.ok || !envelope) {
      return {
        ok: false,
        status: response.status,
        message: envelope?.message ?? "Terjadi kesalahan pada server",
        fields: fieldsFromEnvelope(envelope),
      };
    }
    return { ok: true, status: response.status, data: envelope.data as T, meta: envelope.meta, message: envelope.message };
  } catch {
    return { ok: false, status: 503, message: "Layanan Vowly tidak dapat dihubungi. Coba lagi sebentar lagi.", fields: {} };
  }
}

export async function getToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

/** Server-side call authenticated with the session cookie. */
export async function apiServer<T>(path: string, options: Omit<RequestOptions, "token"> = {}): Promise<ApiResult<T>> {
  return apiRequest<T>(path, { ...options, token: await getToken() });
}

/** The signed-in user, or null. Cached per request. */
export const getSession = cache(async (): Promise<User | null> => {
  const token = await getToken();
  if (!token) return null;
  const result = await apiRequest<User>("/users/me", { token });
  return result.ok ? result.data : null;
});

/** Redirects to the sign-in page (remembering where to return) when there is no valid session. */
export async function requireSession(next?: string): Promise<User> {
  const user = await getSession();
  if (!user) redirect(next ? `/sign-in?next=${encodeURIComponent(next)}` : "/sign-in");
  return user;
}
