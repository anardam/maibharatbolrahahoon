import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/roles";
import {
  getPR,
  getPRFiles,
  mergePR,
  closePR,
  deleteBranch,
  GitHubApiError,
} from "@/lib/github";

interface RouteParams {
  params: Promise<{ prNumber: string }>;
}

// GET /api/review/:prNumber — get PR details + files
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const authResult = await requireAuth("super_admin");
  if (!authResult.authorized) return authResult.response;

  try {
    const { prNumber } = await params;
    const num = parseInt(prNumber, 10);

    const [pr, files] = await Promise.all([getPR(num), getPRFiles(num)]);

    return NextResponse.json({ pr, files });
  } catch (error) {
    if (error instanceof GitHubApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/review/:prNumber — approve & merge, or reject
export async function POST(req: NextRequest, { params }: RouteParams) {
  const authResult = await requireAuth("super_admin");
  if (!authResult.authorized) return authResult.response;

  try {
    const { prNumber } = await params;
    const num = parseInt(prNumber, 10);
    const body = await req.json();
    const { action, comment } = body;

    if (action === "merge") {
      const pr = await getPR(num);
      await mergePR(num);

      // Clean up the branch
      try {
        await deleteBranch(pr.head.ref);
      } catch {
        // Branch cleanup is best-effort
      }

      return NextResponse.json({ success: true, message: "PR merged and published." });
    }

    if (action === "reject") {
      const pr = await getPR(num);
      await closePR(num, comment || "Rejected by Super Admin.");

      try {
        await deleteBranch(pr.head.ref);
      } catch {
        // Branch cleanup is best-effort
      }

      return NextResponse.json({ success: true, message: "PR rejected and closed." });
    }

    return NextResponse.json({ error: "Invalid action. Use 'merge' or 'reject'." }, { status: 400 });
  } catch (error) {
    if (error instanceof GitHubApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
