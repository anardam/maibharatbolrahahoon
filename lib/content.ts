import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content/articles");

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  author: string;
  youtubeUrls?: string[];
  region?: string;
  status: "draft" | "review" | "published";
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  frontmatter: ArticleFrontmatter;
  content: string;
  fileName: string;
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((fileName) => {
      const filePath = path.join(CONTENT_DIR, fileName);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);

      return {
        frontmatter: data as ArticleFrontmatter,
        content,
        fileName,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.createdAt).getTime() -
        new Date(a.frontmatter.createdAt).getTime()
    );
}

export function getPublishedArticles(): Article[] {
  return getAllArticles().filter((a) => a.frontmatter.status === "published");
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.frontmatter.slug === slug);
}

export function getCategories(): { name: string; slug: string }[] {
  const categoriesPath = path.join(process.cwd(), "content/categories.json");
  if (!fs.existsSync(categoriesPath)) return [];
  return JSON.parse(fs.readFileSync(categoriesPath, "utf-8"));
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return getPublishedArticles().filter(
    (a) => a.frontmatter.category === categorySlug
  );
}

export function getCategoryName(slug: string): string {
  const categories = getCategories();
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}
