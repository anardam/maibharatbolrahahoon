import { notFound } from "next/navigation";
import {
  getArticlesByCategory,
  getCategories,
} from "@/lib/content";
import { ArticleCard } from "@/components/article/ArticleCard";

interface Props {
  params: Promise<{ slug: string }>;
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
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="text-muted mt-2">
          {articles.length} articles in this category
        </p>
      </header>

      {articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.frontmatter.slug}
              article={article.frontmatter}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted py-12 text-center">
          No articles in this category yet.
        </p>
      )}
    </div>
  );
}
