import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  /** Base URL of the Vowly Go API (without /api/v1). Server-side only. */
  API_BASE_URL: z.url().default("http://localhost:4000"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3303"),
});

export const serverEnv = serverSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  API_BASE_URL: process.env.API_BASE_URL || undefined,
});

export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || undefined,
});
