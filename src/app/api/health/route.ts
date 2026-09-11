import { apiSuccess } from "@/lib/api/api-response";

export const dynamic = "force-dynamic";

export function GET() {
  const response = apiSuccess({
    status: "ok",
    service: "vowly-client",
    timestamp: new Date().toISOString(),
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
