import type { MetadataRoute } from "next";
import { getPublishedArticles, getCategories } from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.maibharatbolrahahoon.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getPublishedArticles();
  const categories = getCategories();

  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/article/${article.frontmatter.slug}`,
    lastModified: new Date(article.frontmatter.updatedAt || article.frontmatter.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.6,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...categoryUrls,
    ...articleUrls,
  ];
}
