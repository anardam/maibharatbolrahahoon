import Link from "next/link";
import Image from "next/image";
import type { ArticleFrontmatter } from "@/lib/content";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import { getDateLocale } from "@/lib/i18n";

interface ArticleCardProps {
  article: ArticleFrontmatter;
  locale?: Locale;
}

function formatCardDate(dateString: string, locale: Locale) {
  return new Date(dateString).toLocaleDateString(getDateLocale(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ArticleCard({ article, locale = "hi" }: ArticleCardProps) {
  const coverImage =
    article.coverImage ||
    (article.youtubeUrls?.[0]
      ? getYouTubeThumbnail(extractYouTubeId(article.youtubeUrls[0]) || "")
      : null);

  return (
    <Link href={`/article/${article.slug}`}>
      <article className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        {coverImage && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={coverImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {article.youtubeUrls?.length ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform group-hover:scale-110">
                  <svg className="ml-0.5 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            ) : null}
          </div>
        )}
        <div className="p-5">
          <span className="mb-3 inline-block rounded-full bg-[var(--primary)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--primary)]">
            {article.category}
          </span>
          <h2 className="mb-2 line-clamp-2 text-lg font-bold leading-snug tracking-tight">
            {article.title}
          </h2>
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
            {article.excerpt}
          </p>
          <time className="text-xs text-[var(--muted-foreground)]">
            {article.publishedAt
              ? formatCardDate(article.publishedAt, locale)
              : formatCardDate(article.createdAt, locale)}
          </time>
        </div>
      </article>
    </Link>
  );
}
