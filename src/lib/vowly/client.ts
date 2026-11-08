import type { Envelope, FieldError, PageMeta } from "./types";

/** Error thrown for every failed API call in the browser. `fields` maps a JSON field name to its message (422). */
export class ApiError extends Error {
  readonly status: number;
  readonly fields: Record<string, string>;

  constructor(message: string, status: number, fields: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

export type ApiResponse<T> = { data: T; meta?: PageMeta; message: string };
type Query = Record<string, string | number | boolean | undefined | null>;

const BASE = "/api/backend";

export function toQueryString(query?: Query): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }
  const text = params.toString();
  return text ? `?${text}` : "";
}

export function errorFromEnvelope(envelope: Envelope<unknown> | null, status: number): ApiError {
  const data = envelope?.data as { errors?: FieldError[] } | undefined;
  const fields: Record<string, string> = {};
  for (const item of data?.errors ?? []) fields[item.field] = item.message;
  return new ApiError(envelope?.message ?? "Terjadi kesalahan. Coba lagi.", status, fields);
}

async function send<T>(method: string, url: string, body?: unknown, signal?: AbortSignal): Promise<ApiResponse<T>> {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  let response: Response;
  try {
    response = await fetch(url, {
      method,
      credentials: "same-origin",
      headers: isForm || body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError("Tidak dapat terhubung ke server. Periksa koneksi Anda.", 0);
  }
  const envelope = (await response.json().catch(() => null)) as Envelope<T> | null;
  if (!response.ok || !envelope) {
    if (response.status === 401 && typeof window !== "undefined" && !url.startsWith("/api/session")) {
      window.location.assign(`/sign-in?next=${encodeURIComponent(window.location.pathname)}`);
    }
    throw errorFromEnvelope(envelope, response.status);
  }
  return { data: envelope.data as T, meta: envelope.meta, message: envelope.message };
}

function makeClient(base: string) {
  return {
    get: <T>(path: string, query?: Query, signal?: AbortSignal) => send<T>("GET", `${base}${path}${toQueryString(query)}`, undefined, signal),
    post: <T>(path: string, body?: unknown) => send<T>("POST", `${base}${path}`, body ?? {}),
    put: <T>(path: string, body?: unknown) => send<T>("PUT", `${base}${path}`, body ?? {}),
    delete: <T = null>(path: string) => send<T>("DELETE", `${base}${path}`),
    upload: <T>(path: string, form: FormData) => send<T>("POST", `${base}${path}`, form),
  };
}

export type ApiClient = ReturnType<typeof makeClient>;

/** Browser API client. All calls go through the same-origin proxy, which adds the session token. */
export const api = {
  ...makeClient(BASE),
  /** Credential endpoints that set or clear the session cookie. */
  session: <T>(action: "login" | "register" | "logout", body?: unknown) => send<T>("POST", `/api/session/${action}`, body ?? {}),
};

/** Admin-area client (`/api/admin/*`, role-checked on the server). Paths are relative to `/api/v1/admin`. */
export const adminApi: ApiClient = makeClient("/api/admin");
