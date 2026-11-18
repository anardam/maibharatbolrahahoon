import Link from "next/link";
import { getCategories, paginate, searchArticles } from "@/lib/content";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Pagination } from "@/components/layout/Pagination";
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", page: pageParam } = await searchParams;
  const query = q.trim().slice(0, 100);
  const results = searchArticles(query);
  const { items, page, totalPages } = paginate(results, Number(pageParam));
  const categories = getCategories();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold">Search</h1>

      <form action="/search" role="search" className="relative mb-8">
        <label htmlFor="search-input" className="sr-only">
          Search articles
        </label>
        <input
          id="search-input"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search articles..."
          className="border-default w-full rounded-xl border bg-transparent px-4 py-3 pl-12 text-lg outline-none focus:ring-2 focus:ring-[var(--ring)]"
        />
        <svg
          className="text-muted absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </form>

      {query && (
        <p className="text-muted mb-6 text-sm" aria-live="polite">
          {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
        </p>
      )}

      {items.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((article) => (
              <div key={article.frontmatter.slug} className="article-grid-item">
                <ArticleCard article={article.frontmatter} />
              </div>
            ))}
          </div>
          <Pagination basePath={`/search?q=${encodeURIComponent(query)}`} page={page} totalPages={totalPages} />
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center">
          {query && <p className="text-muted mb-4 text-sm">No articles matched your search.</p>}
          <p className="mb-4 text-sm font-medium">Browse by category:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-1.5 text-sm font-medium shadow-sm transition-all hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
