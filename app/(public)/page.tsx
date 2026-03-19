import { getPublishedArticles, getCategories } from "@/lib/content";
import { ArticleCard } from "@/components/article/ArticleCard";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/i18n";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = (lang as Locale) || "hi";
  const t = getTranslations(locale);
  const articles = getPublishedArticles();
  const categories = getCategories();

  return (
    <div>
      {/* Hero */}
      <section className="relative mb-14 overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary)] via-[var(--primary)] to-orange-600 px-6 py-16 text-center text-white shadow-lg md:py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="relative z-10">
          <span className="mb-4 inline-block text-5xl">🇮🇳</span>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight md:text-5xl">
            {t.siteName}
          </h1>
          <p className="mx-auto max-w-md text-base text-white/80 md:text-lg">
            {t.tagline} — {t.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            {t.categories}
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-1.5 text-sm font-medium shadow-sm transition-all hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white hover:shadow-md"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <section>
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            {t.latestArticles}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard
                key={article.frontmatter.slug}
                article={article.frontmatter}
                locale={locale}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-[var(--border)] py-24 text-center">
          <div className="mb-4 text-4xl opacity-40">📰</div>
          <p className="text-lg text-[var(--muted-foreground)]">{t.noArticles}</p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">{t.noArticlesHint}</p>
        </section>
      )}
    </div>
  );
}
