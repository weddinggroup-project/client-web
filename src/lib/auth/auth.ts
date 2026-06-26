import "server-only";
import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { authConfigured, clientEnv, serverEnv } from "@/lib/env";
import {
  TURNSTILE_PROOF_COOKIE,
  verifyTurnstileProof,
} from "@/lib/security/turnstile";

const developmentSecret =
  "ganipedia-development-only-secret-change-before-production";

export const auth = betterAuth({
  appName: "Ganipedia",
  baseURL: serverEnv.BETTER_AUTH_URL ?? clientEnv.NEXT_PUBLIC_APP_URL,
  secret: serverEnv.BETTER_AUTH_SECRET ?? developmentSecret,
  socialProviders: authConfigured
    ? {
        google: {
          clientId: serverEnv.GOOGLE_CLIENT_ID!,
          clientSecret: serverEnv.GOOGLE_CLIENT_SECRET!,
          prompt: "select_account",
        },
      }
    : {},
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60,
      strategy: "jwe",
      refreshCache: true,
    },
  },
  advanced: {
    useSecureCookies: serverEnv.NODE_ENV === "production",
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-in/social" || ctx.body?.provider !== "google") {
        return;
      }

      const cookieHeader = ctx.headers?.get("cookie") ?? "";
      const proof = cookieHeader
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${TURNSTILE_PROOF_COOKIE}=`))
        ?.slice(TURNSTILE_PROOF_COOKIE.length + 1);

      if (!verifyTurnstileProof(proof)) {
        throw new APIError("FORBIDDEN", {
          message: "Turnstile verification is required.",
        });
      }
    }),
  },
  plugins: [nextCookies()],
});

export type AuthSession = typeof auth.$Infer.Session;
