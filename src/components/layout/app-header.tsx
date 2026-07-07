import type { AuthSession } from "@/lib/auth/auth";
import { AppHeaderClient } from "./app-header-client";

export async function AppHeader({ session }: { session: AuthSession }) {
  return (
    <AppHeaderClient
      user={{
        name: session.user.name,
        email: session.user.email,
      }}
    />
  );
}
