import fs from "fs";
import path from "path";
import matter from "gray-matter";
import sanitizeHtml from "sanitize-html";

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

export const PAGE_SIZE = 12;

export function paginate<T>(items: T[], page: number): { items: T[]; page: number; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), totalPages);
  return { items: items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE), page: current, totalPages };
}

// Article bodies are raw HTML from the editor; strip scripts, handlers and unknown tags before rendering
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "h1", "h2", "u", "s"],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      "*": ["style"],
    },
    allowedStyles: { "*": { "text-align": [/^(left|right|center|justify)$/] } },
    allowedSchemes: ["http", "https", "mailto"],
  });
}

function plainText(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });
}

export function searchArticles(query: string): Article[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return getPublishedArticles().filter((a) => {
    const { title, excerpt, category, region, author } = a.frontmatter;
    const haystack = [title, excerpt, category, region, author, plainText(a.content)].join(" ").toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}

// Same category scores 2, same region 1; ties keep newest-first order
export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const { slug, category, region } = article.frontmatter;
  const score = (a: Article) =>
    (a.frontmatter.category === category ? 2 : 0) + (region && a.frontmatter.region === region ? 1 : 0);
  return getPublishedArticles()
    .filter((a) => a.frontmatter.slug !== slug)
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}

export interface BreakingNews {
  active: boolean;
  text: string;
  url?: string;
}

export function getBreakingNews(): BreakingNews | null {
  const breakingPath = path.join(process.cwd(), "content/breaking.json");
  if (!fs.existsSync(breakingPath)) return null;
  const news: BreakingNews = JSON.parse(fs.readFileSync(breakingPath, "utf-8"));
  return news.active && news.text ? news : null;
}
