import { getPublishedArticles, paginate } from "@/lib/content";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Pagination } from "@/components/layout/Pagination";
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export const metadata: Metadata = {
  title: "Latest Articles",
  description: "All the latest news, stories and videos — Mai Bharat Bol Raha Hoon",
};

export default async function LatestPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const all = getPublishedArticles();
  const { items, page, totalPages } = paginate(all, Number(pageParam));

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
          Latest Articles
        </h1>
        <p className="text-muted mt-2">
          {all.length} article{all.length !== 1 ? "s" : ""}
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((article) => (
          <div key={article.frontmatter.slug} className="article-grid-item">
            <ArticleCard article={article.frontmatter} />
          </div>
        ))}
      </div>

      <Pagination basePath="/latest" page={page} totalPages={totalPages} />
    </div>
  );
}
