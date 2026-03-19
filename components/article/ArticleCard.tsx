import Link from "next/link";
import Image from "next/image";
import type { ArticleFrontmatter } from "@/lib/content";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

export type ArticleCardVariant = "hero" | "medium" | "compact";

interface ArticleCardProps {
  article: ArticleFrontmatter;
  locale?: Locale;
  variant?: ArticleCardVariant;
  /** Zero-based index used to stagger the entrance animation */
  index?: number;
}

function formatCardDate(dateString: string, locale: Locale) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatShortDate(dateString: string, locale: Locale) {
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

/* ─────────────────────────────────────────────────────────────────────────────
   HERO variant — large image, title overlay, full bleed. Used for the
   primary featured position. Fills its grid cell completely.
───────────────────────────────────────────────────────────────────────────── */
function HeroCard({ article, locale = "hi" }: { article: ArticleFrontmatter; locale: Locale }) {
  const coverImage = getCoverImage(article);
  const dateString = article.publishedAt ?? article.createdAt;

  return (
    <article
      className="article-card-hero group relative flex h-full min-h-[340px] overflow-hidden rounded-2xl border bg-[var(--foreground)] focus-within:ring-2 focus-within:ring-[var(--ring)] focus-within:ring-offset-2 sm:min-h-[420px] lg:min-h-[480px]"
      style={{ borderColor: "oklch(0.91 0.015 60)" }}
    >
      {/* Full-bleed image */}
      {coverImage ? (
        <div className="absolute inset-0">
          <Image
            src={coverImage}
            alt={article.title}
            fill
            priority
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 60vw"
          />
        </div>
      ) : (
        /* No-image fallback: textured saffron gradient */
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.22 0.06 30) 0%, oklch(0.30 0.12 35) 40%, oklch(0.20 0.04 25) 100%)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Scrim — stronger at bottom for text legibility */}
      <div
        className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-90"
        style={{
          background:
            "linear-gradient(to top, oklch(0.1 0.02 30 / 0.92) 0%, oklch(0.1 0.02 30 / 0.55) 45%, oklch(0.1 0.02 30 / 0.15) 100%)",
        }}
        aria-hidden="true"
      />

      {/* YouTube play badge */}
      {article.youtubeUrls?.length ? (
        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform duration-200 group-hover:scale-110">
          <svg className="ml-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      ) : null}

      {/* Content anchored to bottom */}
      <div className="relative mt-auto p-6 sm:p-7">
        {/* Category badge */}
        <Link
          href={`/category/${article.category}`}
          className="article-category-badge mb-3 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white transition-colors"
          style={{ background: "oklch(0.52 0.22 25 / 0.85)", backdropFilter: "blur(4px)" }}
          tabIndex={-1}
        >
          {article.category}
        </Link>

        <h2 className="mb-3 text-xl font-extrabold leading-snug tracking-tight text-white sm:text-2xl lg:text-3xl">
          <Link
            href={`/article/${article.slug}`}
            className="decoration-white/50 underline-offset-2 transition-colors hover:underline focus:outline-none"
          >
            {article.title}
          </Link>
        </h2>

        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-white/75 sm:text-base">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <time
            dateTime={dateString}
            className="text-xs text-white/60"
          >
            {formatCardDate(dateString, locale)}
          </time>
          {/* Read more arrow — slides in on hover */}
          <span
            className="article-read-arrow flex items-center gap-1.5 text-xs font-semibold text-white/80 transition-all duration-300 group-hover:text-white"
            aria-hidden="true"
          >
            पढ़ें
            <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MEDIUM variant — image on top, content below. Used for second-tier articles.
   Supports both landscape (default) and portrait aspect ratios via CSS.
───────────────────────────────────────────────────────────────────────────── */
function MediumCard({ article, locale = "hi" }: { article: ArticleFrontmatter; locale: Locale }) {
  const coverImage = getCoverImage(article);
  const dateString = article.publishedAt ?? article.createdAt;

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-[var(--card)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-within:ring-2 focus-within:ring-[var(--ring)] focus-within:ring-offset-2"
      style={{ borderColor: "oklch(0.91 0.015 60)" }}
    >
      {/* Primary accent line — slides in on hover */}
      <div
        className="absolute left-0 top-0 h-0.5 w-0 bg-[var(--primary)] transition-all duration-500 group-hover:w-full"
        aria-hidden="true"
      />

      {coverImage ? (
        <div className="relative aspect-[16/9] shrink-0 overflow-hidden">
          <Image
            src={coverImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {article.youtubeUrls?.length ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform group-hover:scale-110">
                <svg className="ml-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        /* No-image: saffron pattern placeholder */
        <div
          className="relative flex aspect-[16/9] shrink-0 items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(135deg, oklch(0.94 0.04 65) 0%, oklch(0.97 0.02 80) 100%)",
          }}
          aria-hidden="true"
        >
          <div
            className="text-5xl opacity-20 transition-transform duration-500 group-hover:scale-110"
            aria-hidden="true"
          >
            ॐ
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <Link
          href={`/category/${article.category}`}
          className="article-category-badge mb-2.5 inline-block self-start rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors"
          style={{
            background: "oklch(0.52 0.22 25 / 0.08)",
            color: "var(--primary)",
          }}
          tabIndex={-1}
        >
          {article.category}
        </Link>

        <h2 className="mb-2 line-clamp-2 flex-1 text-base font-bold leading-snug tracking-tight sm:text-lg">
          <Link
            href={`/article/${article.slug}`}
            className="transition-colors hover:text-[var(--primary)] focus:outline-none"
          >
            {article.title}
          </Link>
        </h2>

        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {article.excerpt}
        </p>

        <div
          className="mt-auto flex items-center justify-between border-t pt-3"
          style={{ borderColor: "oklch(0.93 0.008 60)" }}
        >
          <div className="flex items-center gap-1.5">
            <svg className="h-3 w-3 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time dateTime={dateString} className="text-xs text-[var(--muted-foreground)]">
              {formatShortDate(dateString, locale)}
            </time>
          </div>
          <svg
            className="h-4 w-4 -translate-x-1 text-[var(--primary)] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMPACT / HORIZONTAL variant — thumbnail left, text right. Used for the
   "more articles" list at the bottom of the section.
───────────────────────────────────────────────────────────────────────────── */
function CompactCard({ article, locale = "hi" }: { article: ArticleFrontmatter; locale: Locale }) {
  const coverImage = getCoverImage(article);
  const dateString = article.publishedAt ?? article.createdAt;

  return (
    <article
      className="group flex gap-4 rounded-xl border bg-[var(--card)] p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-[var(--ring)] focus-within:ring-offset-2"
      style={{ borderColor: "oklch(0.91 0.015 60)" }}
    >
      {/* Thumbnail */}
      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-28">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="112px"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: "linear-gradient(135deg, oklch(0.94 0.04 65) 0%, oklch(0.97 0.02 80) 100%)",
            }}
            aria-hidden="true"
          >
            <span className="text-2xl opacity-25">ॐ</span>
          </div>
        )}
        {/* Category dot overlay */}
        <div
          className="absolute bottom-1.5 left-1.5 h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow"
          aria-hidden="true"
        />
      </div>

      {/* Text */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <Link
            href={`/category/${article.category}`}
            className="article-category-badge mb-1.5 inline-block text-[9px] font-bold uppercase tracking-widest transition-colors"
            style={{ color: "var(--primary)" }}
            tabIndex={-1}
          >
            {article.category}
          </Link>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug tracking-tight transition-colors group-hover:text-[var(--primary)]">
            <Link
              href={`/article/${article.slug}`}
              className="focus:outline-none"
            >
              {article.title}
            </Link>
          </h3>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <time dateTime={dateString} className="text-[10px] text-[var(--muted-foreground)]">
            {formatShortDate(dateString, locale)}
          </time>
          <svg
            className="h-3.5 w-3.5 -translate-x-1 text-[var(--primary)] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
            fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Public export — dispatches to the correct variant
───────────────────────────────────────────────────────────────────────────── */
export function ArticleCard({
  article,
  locale = "hi",
  variant = "medium",
}: ArticleCardProps) {
  if (variant === "hero") return <HeroCard article={article} locale={locale} />;
  if (variant === "compact") return <CompactCard article={article} locale={locale} />;
  return <MediumCard article={article} locale={locale} />;
}
