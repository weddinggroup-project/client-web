import type { NextRequest } from "next/server";
import { apiFailure } from "./api-response";
import { normalizeError } from "@/lib/errors/normalize-error";
import { logger } from "@/lib/logger";

type RouteContext = { params: Promise<Record<string, string | string[]>> };
type RouteHandler = (
  request: NextRequest,
  context: RouteContext,
) => Response | Promise<Response>;

export function withApiHandler(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      const normalized = normalizeError(error);

      logger.error("API request failed", {
        error: normalized,
        method: request.method,
        path: request.nextUrl.pathname,
      });

      return apiFailure(
        normalized.code,
        normalized.message,
        normalized.statusCode,
        normalized.details,
      );
    }
  };
}
