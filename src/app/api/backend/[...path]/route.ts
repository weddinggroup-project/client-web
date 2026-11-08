import { NextResponse, type NextRequest } from "next/server";
import { serverEnv } from "@/lib/env";
import { errorEnvelope } from "@/lib/vowly/credentials";
import { isAllowedBackendPath, isSameOrigin } from "@/lib/vowly/proxy-path";
import { SESSION_COOKIE } from "@/lib/vowly/session-cookie";

export const dynamic = "force-dynamic";

const UPSTREAM_TIMEOUT_MS = 30_000;

type Context = { params: Promise<{ path: string[] }> };

/**
 * Same-origin proxy to the Vowly API. The session JWT lives in an httpOnly cookie, so browser code cannot attach it;
 * this handler adds it server-side. Only plain API paths are forwarded (see isAllowedBackendPath).
 */
async function forward(request: NextRequest, { params }: Context) {
  const { path } = await params;
  if (!isAllowedBackendPath(path)) return errorEnvelope(404, "Data tidak ditemukan");

  if (request.method !== "GET" && !isSameOrigin(request.headers.get("origin"), request.headers.get("host"))) {
    return errorEnvelope(403, "Permintaan tidak diizinkan");
  }
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return errorEnvelope(401, "Sesi berakhir. Silakan login kembali.");

  const url = new URL(`/api/v1/${path.join("/")}`, serverEnv.API_BASE_URL);
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

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const DELETE = forward;
