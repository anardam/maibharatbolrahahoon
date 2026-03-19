import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export type Role = "super_admin" | "admin" | "none";

export interface AdminEntry {
  email: string;
  role: "admin";
  name: string;
  addedAt: string;
}

// Super admins — env-based, immutable
const SUPER_ADMIN_EMAILS = (process.env.SUPER_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// Predefined admins from env (optional shortcut)
const ENV_ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function getAdminsFromFile(): AdminEntry[] {
  const filePath = path.join(process.cwd(), "content/admins.json");
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
}

export function isSuperAdminEmail(email: string): boolean {
  return SUPER_ADMIN_EMAILS.includes(email.toLowerCase());
}

export function isWhitelistedEmail(email: string): boolean {
  const lower = email.toLowerCase();

  // Super admins always allowed
  if (SUPER_ADMIN_EMAILS.includes(lower)) return true;

  // Env-based admins
  if (ENV_ADMIN_EMAILS.includes(lower)) return true;

  // File-based admins (managed by super admin)
  const fileAdmins = getAdminsFromFile();
  if (fileAdmins.some((a) => a.email.toLowerCase() === lower)) return true;

  return false;
}

export function getAdminRole(email: string): Role {
  const lower = email.toLowerCase();

  if (SUPER_ADMIN_EMAILS.includes(lower)) return "super_admin";
  if (ENV_ADMIN_EMAILS.includes(lower)) return "admin";

  const fileAdmins = getAdminsFromFile();
  const fileEntry = fileAdmins.find((a) => a.email.toLowerCase() === lower);
  if (fileEntry) return "admin";

  return "none";
}

export function getAllAdmins(): Array<{ email: string; role: Role; name: string; source: "env" | "file" }> {
  const admins: Array<{ email: string; role: Role; name: string; source: "env" | "file" }> = [];

  // Super admins from env
  for (const email of SUPER_ADMIN_EMAILS) {
    admins.push({ email, role: "super_admin", name: "Super Admin", source: "env" });
  }

  // Admins from env
  for (const email of ENV_ADMIN_EMAILS) {
    if (!admins.some((a) => a.email === email)) {
      admins.push({ email, role: "admin", name: "Admin", source: "env" });
    }
  }

  // Admins from file
  const fileAdmins = getAdminsFromFile();
  for (const entry of fileAdmins) {
    if (!admins.some((a) => a.email === entry.email.toLowerCase())) {
      admins.push({ email: entry.email.toLowerCase(), role: "admin", name: entry.name, source: "file" });
    }
  }

  return admins;
}

export async function getUserRole(): Promise<{ role: Role; email: string | null; userId: string | null }> {
  const { userId } = await auth();
  if (!userId) return { role: "none", email: null, userId: null };

  const user = await currentUser();
  if (!user) return { role: "none", email: null, userId: null };

  const email = user.emailAddresses[0]?.emailAddress || null;
  if (!email) return { role: "none", email, userId };

  // Only whitelisted emails get any role
  if (!isWhitelistedEmail(email)) {
    return { role: "none", email, userId };
  }

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
