import "server-only";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { serverEnv } from "@/lib/env";

export const TURNSTILE_PROOF_COOKIE = "ganipedia_turnstile_proof";
const PROOF_MAX_AGE_SECONDS = 120;
const EXPECTED_ACTION = "google_login";

const turnstileResponseSchema = z.object({
  success: z.boolean(),
  hostname: z.string().optional(),
  action: z.string().optional(),
  "error-codes": z.array(z.string()).optional(),
});

export type TurnstileVerification = z.infer<typeof turnstileResponseSchema>;

function proofSecret() {
  return serverEnv.BETTER_AUTH_SECRET;
}

function signature(payload: string) {
  const secret = proofSecret();
  if (!secret) return "";
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createTurnstileProof() {
  const payload = `${Date.now()}.${randomUUID()}`;
  return `${payload}.${signature(payload)}`;
}

export function verifyTurnstileProof(proof: string | undefined) {
  if (!proof || !proofSecret()) return false;

  const [timestamp, nonce, providedSignature] = proof.split(".");
  if (!timestamp || !nonce || !providedSignature) return false;

  const age = Date.now() - Number(timestamp);
  if (!Number.isFinite(age) || age < 0 || age > PROOF_MAX_AGE_SECONDS * 1000) {
    return false;
  }

  const expectedSignature = signature(`${timestamp}.${nonce}`);
  const expected = Buffer.from(expectedSignature);
  const provided = Buffer.from(providedSignature);

  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

export function turnstileProofCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: serverEnv.NODE_ENV === "production",
    path: "/api/auth",
    maxAge: PROOF_MAX_AGE_SECONDS,
  };
}

export async function verifyTurnstileToken({
  token,
  remoteIp,
}: {
  token: string;
  remoteIp?: string;
}): Promise<TurnstileVerification> {
  if (!serverEnv.TURNSTILE_SECRET_KEY) {
    return { success: false, "error-codes": ["missing-secret-key"] };
  }

  const body = new URLSearchParams({
    secret: serverEnv.TURNSTILE_SECRET_KEY,
    response: token,
    idempotency_key: randomUUID(),
  });
  if (remoteIp) body.set("remoteip", remoteIp);

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    },
  );
  const result = turnstileResponseSchema.parse(await response.json());

  if (result.success && result.action !== EXPECTED_ACTION) {
    return { ...result, success: false, "error-codes": ["action-mismatch"] };
  }

  if (
    result.success &&
    serverEnv.TURNSTILE_EXPECTED_HOSTNAME &&
    result.hostname !== serverEnv.TURNSTILE_EXPECTED_HOSTNAME
  ) {
    return { ...result, success: false, "error-codes": ["hostname-mismatch"] };
  }

  return result;
}
