import { notFound } from "next/navigation";
import {
  getArticlesByCategory,
  getCategories,
} from "@/lib/content";
import { ArticleCard } from "@/components/article/ArticleCard";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.maibharatbolrahahoon.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};

  const articles = getArticlesByCategory(slug);
  const description = `Browse ${articles.length} articles in ${category.name} — Mai Bharat Bol Raha Hoon`;

  return {
    title: category.name,
    description,
    openGraph: {
      title: `${category.name} — Mai Bharat Bol Raha Hoon`,
      description,
      url: `${SITE_URL}/category/${slug}`,
    },
    twitter: {
      card: "summary",
      title: category.name,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/category/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const categories = getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) notFound();

  const articles = getArticlesByCategory(slug);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
          {category.name}
        </h1>
        <p className="text-muted mt-2">
          {articles.length} article{articles.length !== 1 ? "s" : ""} in this category
        </p>
      </header>

      {articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <div key={article.frontmatter.slug} className="article-grid-item">
              <ArticleCard
                article={article.frontmatter}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--border)] py-16 text-center">
          <div className="mb-3 text-3xl opacity-30">📰</div>
          <p className="text-sm text-[var(--muted-foreground)]">
            No articles in this category yet.
          </p>
        </div>
      )}
    </div>
  );
}
