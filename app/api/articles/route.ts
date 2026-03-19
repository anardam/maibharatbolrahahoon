import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/roles";
import {
  getMainBranchSha,
  createBranch,
  createOrUpdateFile,
  createPullRequest,
  getContentBranch,
  generateBranchName,
  GitHubApiError,
} from "@/lib/github";
import { serializeArticleToMdx, generateArticleFilePath } from "@/lib/mdx";
import type { ArticlePayload } from "@/lib/mdx";
import { slugify } from "@/lib/utils";
import { getAllArticles } from "@/lib/content";

// GET /api/articles — list all articles
export async function GET() {
  const authResult = await requireAuth("admin");
  if (!authResult.authorized) return authResult.response;

  const articles = getAllArticles();
  return NextResponse.json(articles.map((a) => a.frontmatter));
}

// POST /api/articles — create a new article
export async function POST(req: NextRequest) {
  const authResult = await requireAuth("admin");
  if (!authResult.authorized) return authResult.response;

  try {
    const body = await req.json();
    const { title, excerpt, content, category, coverImage, region, youtubeUrls } = body;

    if (!title || !excerpt || !content || !category) {
      return NextResponse.json({ error: "Missing required fields: title, excerpt, content, category" }, { status: 400 });
    }

    const slug = slugify(title);
    const filePath = generateArticleFilePath(slug);
    const isSuperAdmin = authResult.role === "super_admin";

    const payload: ArticlePayload = {
      title,
      slug,
      excerpt,
      content,
      category,
      author: authResult.email || "unknown",
      coverImage: coverImage || "",
      region: region || "",
      youtubeUrls: youtubeUrls || [],
      status: isSuperAdmin ? "published" : "review",
    };

    const mdxContent = serializeArticleToMdx(payload);

    if (isSuperAdmin) {
      // Super admin: commit directly to main
      await createOrUpdateFile(
        filePath,
        mdxContent,
        `feat: add article "${title}"`,
        getContentBranch()
      );

      return NextResponse.json({
        success: true,
        slug,
        mode: "direct",
        message: "Article published directly.",
      });
    } else {
      // Admin: create branch + PR
      const branchName = generateBranchName("create", slug);
      const mainSha = await getMainBranchSha();

      await createBranch(branchName, mainSha);
      await createOrUpdateFile(filePath, mdxContent, `feat: add article "${title}"`, branchName);

      const pr = await createPullRequest(
        `📝 New article: ${title}`,
        `**Author:** ${authResult.email}\n**Category:** ${category}\n\n${excerpt}`,
        branchName
      );

      return NextResponse.json({
        success: true,
        slug,
        mode: "pr",
        prNumber: pr.number,
        prUrl: pr.html_url,
        message: "Article submitted for review.",
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
