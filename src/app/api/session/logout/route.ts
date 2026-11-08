import type { NextRequest } from "next/server";
import { clearSession } from "@/lib/vowly/credentials";

export const dynamic = "force-dynamic";

export function POST(request: NextRequest) {
  return clearSession(request);
}
