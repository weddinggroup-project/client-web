import type { NextRequest } from "next/server";
import { credentialRoute, registerSchema } from "@/lib/vowly/credentials";

export const dynamic = "force-dynamic";

export function POST(request: NextRequest) {
  return credentialRoute(request, "/auth/register", registerSchema);
}
