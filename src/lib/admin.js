// Server-side admin guard helpers.
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// For Server Components / layouts: returns the session, or null if not admin.
export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

// For API routes: returns true if the caller is an admin.
export async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}
