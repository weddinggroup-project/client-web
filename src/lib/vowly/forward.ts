import "server-only";

import { NextResponse, type NextRequest } from "next/server";
import { serverEnv } from "@/lib/env";
import { errorEnvelope } from "./credentials";
import { isSameOrigin } from "./proxy-path";
import { SESSION_COOKIE } from "./session-cookie";

const UPSTREAM_TIMEOUT_MS = 30_000;

/**
 * Forwards a browser request to the Vowly API with the session JWT from the httpOnly cookie. The caller has already
 * validated the path. State-changing methods must come from the app's own origin.
 */
export async function forwardToApi(request: NextRequest, apiPath: string): Promise<NextResponse> {
  if (request.method !== "GET" && !isSameOrigin(request.headers.get("origin"), request.headers.get("host"))) {
    return errorEnvelope(403, "Permintaan tidak diizinkan");
  }
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return errorEnvelope(401, "Sesi berakhir. Silakan login kembali.");

  const url = new URL(`/api/v1/${apiPath}`, serverEnv.API_BASE_URL);
  url.search = request.nextUrl.search;

  const headers: Record<string, string> = { Authorization: `Bearer ${token}`, Accept: "application/json" };
  const contentType = request.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer(),
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch {
    return errorEnvelope(503, "Layanan Vowly tidak dapat dihubungi. Coba lagi sebentar lagi.");
  }

  const response = new NextResponse(await upstream.arrayBuffer(), {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
  });
  if (upstream.status === 401) response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
