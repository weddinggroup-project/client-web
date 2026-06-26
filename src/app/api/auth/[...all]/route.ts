import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth/auth";
import { authConfigured } from "@/lib/env";
import { apiFailure } from "@/lib/api/api-response";

const handlers = toNextJsHandler(auth);

function unavailable() {
  return apiFailure(
    "AUTH_NOT_CONFIGURED",
    "Authentication belum dikonfigurasi.",
    503,
  );
}

export const GET = authConfigured ? handlers.GET : unavailable;
export const POST = authConfigured ? handlers.POST : unavailable;
