import { slugify } from "./utils";

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

export function serializeArticleToMdx(payload: ArticlePayload): string {
  const slug = payload.slug || slugify(payload.title);
  const now = new Date().toISOString();

  const frontmatter: Record<string, unknown> = {
    title: payload.title,
    slug,
    excerpt: payload.excerpt,
    coverImage: payload.coverImage || "",
    category: payload.category,
    author: payload.author,
    region: payload.region || "",
    youtubeUrls: payload.youtubeUrls?.filter(Boolean) || [],
    status: payload.status,
    publishedAt: payload.status === "published" ? now : "",
    createdAt: now,
    updatedAt: now,
  };

  const yamlLines = Object.entries(frontmatter).map(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length === 0) return `${key}: []`;
      return `${key}:\n${value.map((v) => `  - "${v}"`).join("\n")}`;
    }
    if (typeof value === "string" && (value.includes(":") || value.includes('"') || value.includes("'"))) {
      return `${key}: "${value.replace(/"/g, '\\"')}"`;
    }
    return `${key}: "${value}"`;
  });

  return `---\n${yamlLines.join("\n")}\n---\n\n${payload.content}\n`;
}

export function generateArticleFilePath(slug: string): string {
  return `content/articles/${slug}.mdx`;
}

export function updateArticleMdx(
  existingMdxContent: string,
  updates: Partial<ArticlePayload>
): string {
  // Parse existing frontmatter
  const fmMatch = existingMdxContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) return existingMdxContent;

  const body = updates.content !== undefined ? updates.content : fmMatch[2].trim();

  // Parse existing YAML simply
  const existingLines = fmMatch[1].split("\n");
  const existing: Record<string, string> = {};
  for (const line of existingLines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim().replace(/^"(.*)"$/, "$1");
      existing[key] = val;
    }
  }

  // Build updated payload
  const payload: ArticlePayload = {
    title: updates.title || existing.title || "",
    slug: existing.slug || "",
    excerpt: updates.excerpt || existing.excerpt || "",
    content: body,
    category: updates.category || existing.category || "",
    author: updates.author || existing.author || "",
    coverImage: updates.coverImage ?? existing.coverImage ?? "",
    region: updates.region ?? existing.region ?? "",
    youtubeUrls: updates.youtubeUrls ?? [],
    status: updates.status || (existing.status as ArticlePayload["status"]) || "draft",
  };

  const mdx = serializeArticleToMdx(payload);

  // Preserve original createdAt
  if (existing.createdAt) {
    return mdx.replace(
      /createdAt: "[^"]*"/,
      `createdAt: "${existing.createdAt}"`
    );
  }

  return mdx;
}
