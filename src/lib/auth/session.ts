import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import type { AuthSession } from "./auth";
import { auth } from "./auth";

export const getSession = cache(async () =>
  auth.api.getSession({
    headers: await headers(),
  }),
);

const bypassSession = {
  session: {
    id: "starter-session",
    token: "starter-session-token",
    userId: "starter-user",
    expiresAt: new Date("2099-01-01T00:00:00.000Z"),
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  },
  user: {
    id: "starter-user",
    name: "Admin Vowly",
    email: "admin@gmail.com",
    emailVerified: true,
    image: null,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  },
} satisfies AuthSession;

export async function requireSession() {
  return bypassSession;
}
