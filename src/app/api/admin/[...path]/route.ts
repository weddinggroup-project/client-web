import type { NextRequest } from "next/server";
import { errorEnvelope } from "@/lib/vowly/credentials";
import { forwardToApi } from "@/lib/vowly/forward";
import { hasSafeSegments } from "@/lib/vowly/proxy-path";
import { getSession } from "@/lib/vowly/server";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ path: string[] }> };

/**
 * Proxy for the admin area only: forwards to `/api/v1/admin/<path>`. The caller's role is checked against the API
 * (`/users/me`) first so a normal user gets 403 without reaching the admin endpoints; the API enforces RequireAdmin
 * again on every call, so this is defence in depth, not the only gate.
 */
async function handle(request: NextRequest, { params }: Context) {
  const { path } = await params;
  if (!hasSafeSegments(path)) return errorEnvelope(404, "Data tidak ditemukan");
  const user = await getSession();
  if (!user) return errorEnvelope(401, "Sesi berakhir. Silakan login kembali.");
  if (user.role !== "admin") return errorEnvelope(403, "Akses ditolak");
  return forwardToApi(request, `admin/${path.join("/")}`);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
