import { NextRequest, NextResponse } from "next/server";
import { requireAuth, getAllAdmins } from "@/lib/roles";
import type { AdminEntry } from "@/lib/roles";
import {
  getFileContent,
  createOrUpdateFile,
  getContentBranch,
  GitHubApiError,
} from "@/lib/github";

const ADMINS_PATH = "content/admins.json";

// GET /api/admins — list all admins (super admin only)
export async function GET() {
  const authResult = await requireAuth("super_admin");
  if (!authResult.authorized) return authResult.response;

  const admins = getAllAdmins();
  return NextResponse.json(admins);
}

// POST /api/admins — add a new admin (super admin only)
export async function POST(req: NextRequest) {
  const authResult = await requireAuth("super_admin");
  if (!authResult.authorized) return authResult.response;

  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if already exists
    const existingAdmins = getAllAdmins();
    if (existingAdmins.some((a) => a.email === normalizedEmail)) {
      return NextResponse.json({ error: "This email is already an admin." }, { status: 409 });
    }

    // Read current file from GitHub
    let currentAdmins: AdminEntry[] = [];
    let fileSha: string | undefined;

    try {
      const file = await getFileContent(ADMINS_PATH);
      currentAdmins = JSON.parse(Buffer.from(file.content, "base64").toString("utf-8"));
      fileSha = file.sha;
    } catch {
      // File might not exist yet on GitHub
    }

    const newEntry: AdminEntry = {
      email: normalizedEmail,
      role: "admin",
      name: name.trim(),
      addedAt: new Date().toISOString(),
    };

    const updated = [...currentAdmins, newEntry];

    await createOrUpdateFile(
      ADMINS_PATH,
      JSON.stringify(updated, null, 2) + "\n",
      `feat: add admin "${name}" (${normalizedEmail})`,
      getContentBranch(),
      fileSha
    );

    return NextResponse.json({ success: true, admin: { email: normalizedEmail, role: "admin", name: name.trim(), source: "file" } });
  } catch (error) {
    if (error instanceof GitHubApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
