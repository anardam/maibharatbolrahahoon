import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export type Role = "super_admin" | "admin" | "none";

// Admins are env-only: change the list in Vercel and redeploy
const SUPER_ADMIN_EMAILS = (process.env.SUPER_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const ENV_ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function getAdminRole(email: string): Role {
  const lower = email.toLowerCase();

  if (SUPER_ADMIN_EMAILS.includes(lower)) return "super_admin";
  if (ENV_ADMIN_EMAILS.includes(lower)) return "admin";

  return "none";
}

export async function getUserRole(): Promise<{ role: Role; email: string | null; userId: string | null }> {
  const { userId } = await auth();
  if (!userId) return { role: "none", email: null, userId: null };

  const user = await currentUser();
  if (!user) return { role: "none", email: null, userId: null };

  const email = user.emailAddresses[0]?.emailAddress || null;
  if (!email) return { role: "none", email, userId };

  return { role: getAdminRole(email), email, userId };
}

export async function requireAuth(minRole: Role = "admin") {
  const { role, email, userId } = await getUserRole();

  if (role === "none" || !userId) {
    return {
      authorized: false as const,
      response: NextResponse.json({ error: "Unauthorized — your email is not whitelisted." }, { status: 401 }),
      role: "none" as Role,
      email: null as string | null,
    };
  }

  if (minRole === "super_admin" && role !== "super_admin") {
    return {
      authorized: false as const,
      response: NextResponse.json({ error: "Insufficient permissions — Super Admin required." }, { status: 403 }),
      role,
      email,
    };
  }

  return { authorized: true as const, role, email, userId };
}
