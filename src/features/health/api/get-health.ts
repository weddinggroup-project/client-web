import { fetchApi } from "@/lib/api/fetch-api";
import { clientEnv } from "@/lib/env";
import {
  healthResponseSchema,
  type HealthResponse,
} from "@/features/health/schemas/health.schema";

export function getHealth() {
  return fetchApi<HealthResponse, typeof healthResponseSchema>(
    `${clientEnv.NEXT_PUBLIC_APP_URL}/api/health`,
    {
      schema: healthResponseSchema,
      cache: "no-store",
      retries: 0,
    },
  );
}
