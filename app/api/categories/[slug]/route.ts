import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/roles";
import {
  getFileContent,
  createOrUpdateFile,
  getContentBranch,
  GitHubApiError,
} from "@/lib/github";

const CATEGORIES_PATH = "content/categories.json";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// PUT /api/categories/:slug — update a category (super admin only)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const authResult = await requireAuth("super_admin");
  if (!authResult.authorized) return authResult.response;

  try {
    const { slug } = await params;
    const body = await req.json();

    const file = await getFileContent(CATEGORIES_PATH);
    const categories = JSON.parse(
      Buffer.from(file.content, "base64").toString("utf-8")
    );

    const index = categories.findIndex((c: { slug: string }) => c.slug === slug);
    if (index === -1) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    categories[index] = { ...categories[index], ...body };

    await createOrUpdateFile(
      CATEGORIES_PATH,
      JSON.stringify(categories, null, 2) + "\n",
      `update: edit category "${body.name || slug}"`,
      getContentBranch(),
      file.sha
    );

    return NextResponse.json({ success: true, category: categories[index] });
  } catch (error) {
    if (error instanceof GitHubApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/categories/:slug — delete a category (super admin only)
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const authResult = await requireAuth("super_admin");
  if (!authResult.authorized) return authResult.response;

  try {
    const { slug } = await params;

    const file = await getFileContent(CATEGORIES_PATH);
    const categories = JSON.parse(
      Buffer.from(file.content, "base64").toString("utf-8")
    );

    const filtered = categories.filter((c: { slug: string }) => c.slug !== slug);

    if (filtered.length === categories.length) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    await createOrUpdateFile(
      CATEGORIES_PATH,
      JSON.stringify(filtered, null, 2) + "\n",
      `delete: remove category "${slug}"`,
      getContentBranch(),
      file.sha
    );

    return NextResponse.json({ success: true, message: "Category deleted." });
  } catch (error) {
    if (error instanceof GitHubApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
