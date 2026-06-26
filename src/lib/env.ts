import { z } from "zod";

const optionalString = (schema: z.ZodType<string>) =>
  z.preprocess((value) => (value === "" ? undefined : value), schema.optional());

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  BETTER_AUTH_SECRET: optionalString(z.string().min(32)),
  BETTER_AUTH_URL: optionalString(z.url()),
  GOOGLE_CLIENT_ID: optionalString(z.string().min(1)),
  GOOGLE_CLIENT_SECRET: optionalString(z.string().min(1)),
  TURNSTILE_SITE_KEY: optionalString(z.string().min(1)),
  TURNSTILE_SECRET_KEY: optionalString(z.string().min(1)),
  TURNSTILE_EXPECTED_HOSTNAME: optionalString(z.string().min(1)),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
});

export const serverEnv = serverSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  TURNSTILE_EXPECTED_HOSTNAME: process.env.TURNSTILE_EXPECTED_HOSTNAME,
});

export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

export const authConfigured = Boolean(
  serverEnv.BETTER_AUTH_SECRET &&
    serverEnv.GOOGLE_CLIENT_ID &&
    serverEnv.GOOGLE_CLIENT_SECRET,
);

export const turnstileConfigured = Boolean(
  serverEnv.TURNSTILE_SITE_KEY && serverEnv.TURNSTILE_SECRET_KEY,
);

export const loginConfigured = authConfigured && turnstileConfigured;
