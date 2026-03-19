import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/roles";
import { listOpenPRs, GitHubApiError } from "@/lib/github";

// GET /api/review — list open content PRs
export async function GET() {
  const authResult = await requireAuth("super_admin");
  if (!authResult.authorized) return authResult.response;

  try {
    const allPRs = await listOpenPRs();

    // Filter to content-related PRs only
    const contentPRs = allPRs.filter(
      (pr) => pr.head.ref.startsWith("content/")
    );

    return NextResponse.json(contentPRs);
  } catch (error) {
    if (error instanceof GitHubApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
