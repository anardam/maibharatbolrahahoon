import Link from "next/link";
import type { Article } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { ArticleCard } from "./ArticleCard";

interface ArticlesSectionProps {
  articles: Article[];
  locale: Locale;
  totalCount: number;
  translations: {
    latestArticles: string;
    readMore: string;
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section divider — thin ruled line with a centred label, matching the
   existing categories divider style but with an added primary accent dot.
───────────────────────────────────────────────────────────────────────────── */
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="mb-7 flex items-center gap-4">
      {/* Left rule fades out toward center */}
      <div
        className="h-px flex-1"
        style={{ background: "linear-gradient(to right, transparent, var(--border))" }}
        aria-hidden="true"
      />
      {/* Accent dot + label */}
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--primary)]"
          aria-hidden="true"
        />
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          {label}
        </span>
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--primary)]"
          aria-hidden="true"
        />
      </div>
      {/* Right rule fades out toward center */}
      <div
        className="h-px flex-1"
        style={{ background: "linear-gradient(to left, transparent, var(--border))" }}
        aria-hidden="true"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   "View all" CTA — inline text link with an animated arrow
───────────────────────────────────────────────────────────────────────────── */
function ViewAllLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="view-all-link group ml-auto flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] transition-colors hover:text-[var(--foreground)]"
    >
      {label}
      <svg
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section heading row — vertical accent bar, title, article count badge,
   and optional "view all" link on the right.
───────────────────────────────────────────────────────────────────────────── */
function SectionHeading({
  title,
  count,
  viewAllHref,
  viewAllLabel,
}: {
  title: string;
  count?: number;
  viewAllHref?: string;
  viewAllLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      {/* Primary vertical bar */}
      <div className="h-6 w-1 rounded-full bg-[var(--primary)]" aria-hidden="true" />
      <h2 className="text-base font-bold tracking-tight text-[var(--foreground)] sm:text-lg">
        {title}
      </h2>
      {count !== undefined && (
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{
            background: "oklch(0.52 0.22 25 / 0.1)",
            color: "var(--primary)",
          }}
        >
          {count}
        </span>
      )}
      {viewAllHref && viewAllLabel && (
        <ViewAllLink href={viewAllHref} label={viewAllLabel} />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   The main section component.

   Layout:
     ┌──────────────────────────────────────────────────────┐
     │  BLOCK 1 — "Magazine lead" (lg: hero left + 2 medium │
     │             stacked right; mobile: hero then 2 medium │
     │             in a row)                                 │
     ├──────────────────────────────────────────────────────┤
     │  ── divider ──                                       │
     ├──────────────────────────────────────────────────────┤
     │  BLOCK 2 — "Mid-tier trio" (lg: 3-col equal grid;    │
     │             mobile: 1-col)                           │
     ├──────────────────────────────────────────────────────┤
     │  ── divider ──                                       │
     ├──────────────────────────────────────────────────────┤
     │  BLOCK 3 — "Compact list" (4 horizontal cards in a   │
     │             2-col grid on lg, 1-col on mobile)        │
     └──────────────────────────────────────────────────────┘

   Article allocation (for N articles):
     - 0: nothing
     - 1: hero only
     - 2: hero + 1 medium
     - 3: hero + 2 medium (full block 1)
     - 4-6: block 1 + 1-3 mid-tier
     - 7+: all three blocks, remainder goes to compact
───────────────────────────────────────────────────────────────────────────── */
export function ArticlesSection({
  articles,
  locale,
  totalCount,
  translations,
}: ArticlesSectionProps) {
  if (articles.length === 0) return null;

  // Slice the article list into layout buckets
  const heroArticle = articles[0];
  const mediumArticles = articles.slice(1, 3);   // up to 2
  const midTierArticles = articles.slice(3, 6);  // up to 3
  const compactArticles = articles.slice(6, 10); // up to 4

  const viewAllLabel = "View all";
  const moreLabel = "More articles";

  return (
    <section aria-labelledby="articles-section-heading">
      {/* ── Section heading ───────────────────────────────────────────────── */}
      <SectionHeading
        title={translations.latestArticles}
        count={totalCount}
        viewAllHref="/articles"
        viewAllLabel={viewAllLabel}
      />

      {/* ── BLOCK 1: Magazine lead ────────────────────────────────────────── */}
      {/*
          Mobile:  heroArticle full-width, then mediumArticles in a 2-col row
          Desktop: hero takes left 60%, medium stack takes right 40%
      */}
      <div className="mb-10 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        {/* Hero */}
        <div className="articles-section-item lg:row-span-2">
          <ArticleCard
            article={heroArticle.frontmatter}
            locale={locale}
            variant="hero"
          />
        </div>

        {/* Medium pair — stacked on desktop, side-by-side row on small screens */}
        {mediumArticles.length > 0 && (
          <div className="grid grid-cols-2 gap-5 lg:col-start-2 lg:grid-cols-1">
            {mediumArticles.map((article, i) => (
              <div key={article.frontmatter.slug} className={`articles-section-item articles-section-item--delay-${i + 1}`}>
                <ArticleCard
                  article={article.frontmatter}
                  locale={locale}
                  variant="medium"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── BLOCK 2: Mid-tier trio ────────────────────────────────────────── */}
      {midTierArticles.length > 0 && (
        <>
          <SectionDivider label="More news" />
          <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {midTierArticles.map((article, i) => (
              <div key={article.frontmatter.slug} className={`articles-section-item articles-section-item--delay-${i}`}>
                <ArticleCard
                  article={article.frontmatter}
                  locale={locale}
                  variant="medium"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── BLOCK 3: Compact list ─────────────────────────────────────────── */}
      {compactArticles.length > 0 && (
        <>
          <SectionDivider label="Recent articles" />

          <div className="grid gap-3 sm:grid-cols-2">
            {compactArticles.map((article, i) => (
              <div key={article.frontmatter.slug} className={`articles-section-item articles-section-item--delay-${i}`}>
                <ArticleCard
                  article={article.frontmatter}
                  locale={locale}
                  variant="compact"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── "View all articles" CTA ───────────────────────────────────────── */}
      {totalCount > articles.length && (
        <div className="mt-10 flex justify-center">
          <Link
            href="/articles"
            className="articles-view-all-btn group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border px-8 py-3 text-sm font-bold tracking-wide transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2"
            style={{
              borderColor: "var(--primary)",
              color: "var(--primary)",
              background: "transparent",
            }}
          >
            {/* Fill on hover */}
            <span
              className="absolute inset-0 -z-10 translate-y-full rounded-full bg-[var(--primary)] transition-transform duration-300 group-hover:translate-y-0"
              aria-hidden="true"
            />
            <span className="relative transition-colors duration-300 group-hover:text-white">
              {moreLabel}
            </span>
            <svg
              className="relative h-4 w-4 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </section>
  );
}
