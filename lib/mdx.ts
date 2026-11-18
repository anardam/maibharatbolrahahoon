import matter from "gray-matter";
import { slugify } from "./utils";
import type { Article } from "./content";

export interface ArticlePayload {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  coverImage?: string;
  region?: string;
  youtubeUrls?: string[];
  status: "draft" | "review" | "published";
}

// gray-matter's YAML dumper quotes and escapes values, so titles with ", :, \ or newlines round-trip safely
export function serializeArticleToMdx(
  payload: ArticlePayload,
  dates: { createdAt?: string; publishedAt?: string } = {}
): string {
  const now = new Date().toISOString();

  const frontmatter = {
    title: payload.title,
    slug: payload.slug || slugify(payload.title),
    excerpt: payload.excerpt,
    coverImage: payload.coverImage || "",
    category: payload.category,
    author: payload.author,
    region: payload.region || "",
    youtubeUrls: payload.youtubeUrls?.filter(Boolean) || [],
    status: payload.status,
    publishedAt: payload.status === "published" ? dates.publishedAt || now : "",
    createdAt: dates.createdAt || now,
    updatedAt: now,
  };

  return matter.stringify(`\n${payload.content}\n`, frontmatter);
}

export function generateArticleFilePath(slug: string): string {
  return `content/articles/${slug}.mdx`;
}

export function updateArticleMdx(article: Article, updates: Partial<ArticlePayload>): string {
  const existing = article.frontmatter;

  const payload: ArticlePayload = {
    title: updates.title || existing.title,
    slug: existing.slug,
    excerpt: updates.excerpt || existing.excerpt,
    content: updates.content ?? article.content.trim(),
    category: updates.category || existing.category,
    author: updates.author || existing.author,
    coverImage: updates.coverImage ?? existing.coverImage,
    region: updates.region ?? existing.region,
    youtubeUrls: updates.youtubeUrls ?? existing.youtubeUrls,
    status: updates.status || existing.status,
  };

  return serializeArticleToMdx(payload, {
    createdAt: existing.createdAt,
    publishedAt: existing.publishedAt,
  });
}
