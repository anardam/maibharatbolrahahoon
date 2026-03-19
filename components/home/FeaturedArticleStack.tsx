import Link from "next/link";
import Image from "next/image";
import type { ArticleFrontmatter } from "@/lib/content";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

interface FeaturedArticleStackProps {
  articles: ArticleFrontmatter[];
  locale: Locale;
}

function formatCardDate(dateString: string, locale: Locale) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

function getCoverImage(article: ArticleFrontmatter): string | null {
  return (
    article.coverImage ||
    (article.youtubeUrls?.[0]
      ? getYouTubeThumbnail(extractYouTubeId(article.youtubeUrls[0]) || "")
      : null)
  );
}

export function FeaturedArticleStack({ articles, locale }: FeaturedArticleStackProps) {
  if (articles.length === 0) return null;

  const [featured, ...secondary] = articles;
  const featuredImage = getCoverImage(featured);
  const dateString = featured.publishedAt ?? featured.createdAt;

  return (
    <div className="flex flex-col gap-3">
      {/* Featured — image card with scrim overlay */}
      <article
        className="group relative min-h-[200px] overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg sm:min-h-[240px]"
        style={{ borderColor: "oklch(0.91 0.015 60)" }}
      >
        {/* Image or gradient fallback */}
        {featuredImage ? (
          <div className="absolute inset-0">
            <Image
              src={featuredImage}
              alt={featured.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 35vw"
            />
          </div>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, oklch(0.30 0.12 35) 0%, oklch(0.20 0.06 25) 100%)",
            }}
            aria-hidden="true"
          />
        )}

        {/* Scrim */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, oklch(0.1 0.02 30 / 0.88) 0%, oklch(0.1 0.02 30 / 0.4) 50%, oklch(0.1 0.02 30 / 0.1) 100%)",
          }}
          aria-hidden="true"
        />

        {/* YouTube badge */}
        {featured.youtubeUrls?.length ? (
          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
            <svg className="ml-0.5 h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        ) : null}

        {/* Content at bottom */}
        <div className="relative flex h-full min-h-[200px] flex-col justify-end p-4 sm:min-h-[240px] sm:p-5">
          <Link
            href={`/category/${featured.category}`}
            className="mb-2 inline-block self-start rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white"
            style={{ background: "oklch(0.52 0.22 25 / 0.85)" }}
            tabIndex={-1}
          >
            {featured.category}
          </Link>
          <h2 className="mb-1.5 line-clamp-2 text-base font-bold leading-snug text-white sm:text-lg">
            <Link
              href={`/article/${featured.slug}`}
              className="decoration-white/40 underline-offset-2 transition-colors hover:underline focus:outline-none"
            >
              {featured.title}
            </Link>
          </h2>
          <div className="flex items-center justify-between">
            <time dateTime={dateString} className="text-[10px] text-white/60">
              {formatCardDate(dateString, locale)}
            </time>
            <svg
              className="h-3.5 w-3.5 text-white/50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white/80"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>

      {/* Secondary — compact horizontal cards */}
      {secondary.slice(0, 2).map((article) => {
        const thumb = getCoverImage(article);
        const artDate = article.publishedAt ?? article.createdAt;

        return (
          <article
            key={article.slug}
            className="group flex gap-3 overflow-hidden rounded-xl border bg-[var(--card)] p-2.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            style={{ borderColor: "oklch(0.91 0.015 60)" }}
          >
            {/* Thumbnail */}
            <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg sm:h-[72px] sm:w-24">
              {thumb ? (
                <Image
                  src={thumb}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-400 group-hover:scale-110"
                  sizes="96px"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center rounded-lg"
                  style={{ background: "linear-gradient(135deg, oklch(0.94 0.04 65), oklch(0.97 0.02 80))" }}
                  aria-hidden="true"
                >
                  <span className="text-lg opacity-20">📰</span>
                </div>
              )}
              {/* YouTube mini badge */}
              {article.youtubeUrls?.length ? (
                <div className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600">
                  <svg className="ml-px h-2 w-2 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              ) : null}
            </div>

            {/* Text */}
            <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
              <div>
                <span
                  className="mb-1 inline-block text-[8px] font-bold uppercase tracking-widest"
                  style={{ color: "var(--primary)" }}
                >
                  {article.category}
                </span>
                <h3 className="line-clamp-2 text-xs font-bold leading-snug transition-colors group-hover:text-[var(--primary)] sm:text-sm">
                  <Link href={`/article/${article.slug}`} className="focus:outline-none">
                    {article.title}
                  </Link>
                </h3>
              </div>
              <time dateTime={artDate} className="mt-1 text-[9px] text-[var(--muted-foreground)]">
                {formatCardDate(artDate, locale)}
              </time>
            </div>
          </article>
        );
      })}
    </div>
  );
}
