import { getSession } from "@/lib/auth/session";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const session = await getSession();

  return <NavbarClient isAuthenticated={Boolean(session)} />;
}
