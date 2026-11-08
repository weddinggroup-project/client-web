import type { NextRequest } from "next/server";
import { errorEnvelope } from "@/lib/vowly/credentials";
import { forwardToApi } from "@/lib/vowly/forward";
import { isAllowedBackendPath } from "@/lib/vowly/proxy-path";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ path: string[] }> };

/**
 * Same-origin proxy to the Vowly API. The session JWT lives in an httpOnly cookie, so browser code cannot attach it;
 * the shared forwarder adds it server-side. Only plain API paths are forwarded (see isAllowedBackendPath); the admin
 * area is deliberately not reachable here (it has its own role-checked route, /api/admin).
 */
async function handle(request: NextRequest, { params }: Context) {
  const { path } = await params;
  if (!isAllowedBackendPath(path)) return errorEnvelope(404, "Data tidak ditemukan");
  return forwardToApi(request, path.join("/"));
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
