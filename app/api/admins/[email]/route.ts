import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isSuperAdminEmail } from "@/lib/roles";
import type { AdminEntry } from "@/lib/roles";
import {
  getFileContent,
  createOrUpdateFile,
  getContentBranch,
  GitHubApiError,
} from "@/lib/github";

const ADMINS_PATH = "content/admins.json";

interface RouteParams {
  params: Promise<{ email: string }>;
}

// DELETE /api/admins/:email — remove an admin (super admin only)
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const authResult = await requireAuth("super_admin");
  if (!authResult.authorized) return authResult.response;

  try {
    const { email } = await params;
    const normalizedEmail = decodeURIComponent(email).toLowerCase();

    // Cannot remove super admins (they're env-based)
    if (isSuperAdminEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: "Cannot remove Super Admins. They are configured in environment variables." },
        { status: 403 }
      );
    }

    // Read current file
    const file = await getFileContent(ADMINS_PATH);
    const currentAdmins: AdminEntry[] = JSON.parse(
      Buffer.from(file.content, "base64").toString("utf-8")
    );

    const filtered = currentAdmins.filter(
      (a) => a.email.toLowerCase() !== normalizedEmail
    );

    if (filtered.length === currentAdmins.length) {
      return NextResponse.json({ error: "Admin not found in file-based list." }, { status: 404 });
    }

    await createOrUpdateFile(
      ADMINS_PATH,
      JSON.stringify(filtered, null, 2) + "\n",
      `chore: remove admin "${normalizedEmail}"`,
      getContentBranch(),
      file.sha
    );

    return NextResponse.json({ success: true, message: `Admin ${normalizedEmail} removed.` });
  } catch (error) {
    if (error instanceof GitHubApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
