import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/roles";
import {
  getFileSha,
  createOrUpdateFile,
  deleteFile,
  getContentBranch,
  getMainBranchSha,
  createBranch,
  createPullRequest,
  generateBranchName,
  GitHubApiError,
} from "@/lib/github";
import { generateArticleFilePath, updateArticleMdx } from "@/lib/mdx";
import { getArticleBySlug } from "@/lib/content";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET /api/articles/:slug — get a single article
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const authResult = await requireAuth("admin");
  if (!authResult.authorized) return authResult.response;

  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json({
    frontmatter: article.frontmatter,
    content: article.content,
  });
}

// PUT /api/articles/:slug — update an existing article
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const authResult = await requireAuth("admin");
  if (!authResult.authorized) return authResult.response;

  try {
    const { slug } = await params;
    const body = await req.json();
    const filePath = generateArticleFilePath(slug);
    const isSuperAdmin = authResult.role === "super_admin";

    // Get existing article content
    const article = getArticleBySlug(slug);
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Rebuild MDX with updates
    const existingMdx = `---\ntitle: "${article.frontmatter.title}"\nslug: "${article.frontmatter.slug}"\nexcerpt: "${article.frontmatter.excerpt}"\ncoverImage: "${article.frontmatter.coverImage || ""}"\ncategory: "${article.frontmatter.category}"\nauthor: "${article.frontmatter.author}"\nregion: "${article.frontmatter.region || ""}"\nyoutubeUrls: []\nstatus: "${article.frontmatter.status}"\npublishedAt: "${article.frontmatter.publishedAt || ""}"\ncreatedAt: "${article.frontmatter.createdAt}"\nupdatedAt: "${article.frontmatter.updatedAt}"\n---\n\n${article.content}`;

    const updatedMdx = updateArticleMdx(existingMdx, {
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category,
      coverImage: body.coverImage,
      region: body.region,
      youtubeUrls: body.youtubeUrls,
      status: isSuperAdmin ? (body.status || article.frontmatter.status) : "review",
    });

    if (isSuperAdmin) {
      const sha = await getFileSha(filePath);
      await createOrUpdateFile(
        filePath,
        updatedMdx,
        `update: edit article "${body.title || article.frontmatter.title}"`,
        getContentBranch(),
        sha
      );

      return NextResponse.json({
        success: true,
        mode: "direct",
        message: "Article updated.",
      });
    } else {
      const branchName = generateBranchName("edit", slug);
      const mainSha = await getMainBranchSha();
      await createBranch(branchName, mainSha);

      // Get SHA from the new branch (same as main for a fresh branch)
      const sha = await getFileSha(filePath, branchName);
      await createOrUpdateFile(
        filePath,
        updatedMdx,
        `update: edit article "${body.title || article.frontmatter.title}"`,
        branchName,
        sha
      );

      const pr = await createPullRequest(
        `✏️ Edit article: ${body.title || article.frontmatter.title}`,
        `**Edited by:** ${authResult.email}\n\nChanges submitted for review.`,
        branchName
      );

      return NextResponse.json({
        success: true,
        mode: "pr",
        prNumber: pr.number,
        prUrl: pr.html_url,
        message: "Changes submitted for review.",
      });
    }
  } catch (error) {
    if (error instanceof GitHubApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/articles/:slug — delete an article
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const authResult = await requireAuth("admin");
  if (!authResult.authorized) return authResult.response;

  try {
    const { slug } = await params;
    const filePath = generateArticleFilePath(slug);
    const isSuperAdmin = authResult.role === "super_admin";

    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: "Only Super Admins can delete articles. Contact a Super Admin." },
        { status: 403 }
      );
    }

    const sha = await getFileSha(filePath);
    await deleteFile(filePath, `delete: remove article "${slug}"`, getContentBranch(), sha);

    return NextResponse.json({ success: true, message: "Article deleted." });
  } catch (error) {
    if (error instanceof GitHubApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
