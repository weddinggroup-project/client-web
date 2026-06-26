import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiFailure } from "@/lib/api";
import { logger } from "@/lib/logger";
import {
  createTurnstileProof,
  TURNSTILE_PROOF_COOKIE,
  turnstileProofCookieOptions,
  verifyTurnstileToken,
} from "@/lib/security/turnstile";

const inputSchema = z.object({
  token: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiFailure("TURNSTILE_TOKEN_REQUIRED", "Verifikasi keamanan diperlukan.", 400);
  }

  const remoteIp =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  try {
    const result = await verifyTurnstileToken({
      token: parsed.data.token,
      remoteIp,
    });

    if (!result.success) {
      logger.warn("Turnstile verification rejected", {
        errors: result["error-codes"],
      });
      return apiFailure(
        "TURNSTILE_FAILED",
        "Verifikasi keamanan gagal. Silakan coba lagi.",
        400,
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(
      TURNSTILE_PROOF_COOKIE,
      createTurnstileProof(),
      turnstileProofCookieOptions(),
    );
    return response;
  } catch (error) {
    logger.error("Turnstile verification unavailable", { error });
    return apiFailure(
      "TURNSTILE_UNAVAILABLE",
      "Layanan verifikasi sedang tidak tersedia.",
      503,
    );
  }
}
