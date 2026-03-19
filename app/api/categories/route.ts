import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/roles";
import {
  getFileContent,
  createOrUpdateFile,
  getContentBranch,
  GitHubApiError,
} from "@/lib/github";
import { getCategories } from "@/lib/content";
import { slugify } from "@/lib/utils";

const CATEGORIES_PATH = "content/categories.json";

// GET /api/categories
export async function GET() {
  const authResult = await requireAuth("admin");
  if (!authResult.authorized) return authResult.response;

  const categories = getCategories();
  return NextResponse.json(categories);
}

// POST /api/categories — add a new category (super admin only)
export async function POST(req: NextRequest) {
  const authResult = await requireAuth("super_admin");
  if (!authResult.authorized) return authResult.response;

  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = body.slug || slugify(name);

    // Get current categories from GitHub (to get SHA)
    const file = await getFileContent(CATEGORIES_PATH);
    const currentCategories = JSON.parse(
      Buffer.from(file.content, "base64").toString("utf-8")
    );

    // Check for duplicates
    if (currentCategories.some((c: { slug: string }) => c.slug === slug)) {
      return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }

    const updated = [...currentCategories, { name, slug }];

    await createOrUpdateFile(
      CATEGORIES_PATH,
      JSON.stringify(updated, null, 2) + "\n",
      `feat: add category "${name}"`,
      getContentBranch(),
      file.sha
    );

    return NextResponse.json({ success: true, category: { name, slug } });
  } catch (error) {
    if (error instanceof GitHubApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
