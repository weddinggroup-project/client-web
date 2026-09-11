import "server-only";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { clientEnv, serverEnv } from "@/lib/env";

const developmentSecret =
  "vowly-development-only-secret-change-before-production";

export const auth = betterAuth({
  appName: "Vowly",
  baseURL: serverEnv.BETTER_AUTH_URL ?? clientEnv.NEXT_PUBLIC_APP_URL,
  secret: serverEnv.BETTER_AUTH_SECRET ?? developmentSecret,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },
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
  plugins: [nextCookies()],
});

export type AuthSession = typeof auth.$Infer.Session;
