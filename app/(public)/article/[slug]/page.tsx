import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getArticleBySlug, getPublishedArticles } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { YouTubeEmbed } from "@/components/article/YouTubeEmbed";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: `${article.frontmatter.title} | Mai Bharat Bol Raha Hoon`,
    description: article.frontmatter.excerpt,
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.excerpt,
      images: article.frontmatter.coverImage
        ? [article.frontmatter.coverImage]
        : [],
    },
  };
}

export async function generateStaticParams() {
  const articles = getPublishedArticles();
  return articles.map((a) => ({ slug: a.frontmatter.slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article || article.frontmatter.status !== "published") {
    notFound();
  }

  const { frontmatter, content } = article;
  const dateString = frontmatter.publishedAt ?? frontmatter.createdAt;

  return (
    <article className="mx-auto max-w-3xl">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <li>
            <Link href="/" className="transition-colors hover:text-[var(--primary)]">
              <svg className="mr-1 inline-block h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-[var(--border)]">/</li>
          <li>
            <Link href={`/category/${frontmatter.category}`} className="transition-colors hover:text-[var(--primary)]">
              {frontmatter.category}
            </Link>
          </li>
          <li aria-hidden="true" className="text-[var(--border)]">/</li>
          <li aria-current="page" className="max-w-[200px] truncate text-[var(--foreground)]">
            {frontmatter.title}
          </li>
        </ol>
      </nav>

      {/* Hero cover image */}
      {frontmatter.coverImage && (
        <div
          className="relative mb-8 aspect-[2/1] overflow-hidden rounded-2xl shadow-lg"
          style={{ animation: "fadeIn 500ms ease-out both" }}
        >
          <Image
            src={frontmatter.coverImage}
            alt={frontmatter.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          {/* Subtle gradient overlay at bottom */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, oklch(0.1 0.02 30 / 0.15) 0%, transparent 40%)",
            }}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-10">
        <Link
          href={`/category/${frontmatter.category}`}
          className="mb-4 inline-block rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-widest transition-colors"
          style={{
            background: "oklch(0.52 0.22 25 / 0.1)",
            color: "var(--primary)",
          }}
        >
          {frontmatter.category}
        </Link>

        <h1
          className="mb-4 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl lg:text-[2.75rem]"
          style={{ letterSpacing: "-0.02em" }}
        >
          {frontmatter.title}
        </h1>

        <p className="mb-6 text-lg leading-relaxed text-[var(--muted-foreground)]">
          {frontmatter.excerpt}
        </p>

        {/* Author + date bar */}
        <div
          className="flex items-center gap-4 border-y py-4 text-sm"
          style={{ borderColor: "oklch(0.93 0.008 60)" }}
        >
          {/* Author avatar placeholder */}
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: "oklch(0.52 0.22 25)" }}
          >
            {frontmatter.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-[var(--foreground)]">{frontmatter.author}</p>
            <time dateTime={dateString} className="text-xs text-[var(--muted-foreground)]">
              {formatDate(dateString)}
            </time>
          </div>
        </div>
      </header>

      {/* YouTube Videos */}
      {frontmatter.youtubeUrls?.filter(Boolean).length ? (
        <div className="mb-10">
          {frontmatter.youtubeUrls.map((url, i) => (
            <YouTubeEmbed key={i} url={url} title={frontmatter.title} />
          ))}
        </div>
      ) : null}

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      {/* Bottom divider + back link */}
      <div className="mt-12 border-t pt-8" style={{ borderColor: "oklch(0.93 0.008 60)" }}>
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 text-sm font-semibold text-[var(--primary)] transition-colors hover:text-[var(--foreground)]"
          >
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          {frontmatter.category && (
            <Link
              href={`/category/${frontmatter.category}`}
              className="rounded-full border px-4 py-1.5 text-xs font-semibold transition-all hover:shadow-sm"
              style={{
                borderColor: "oklch(0.91 0.015 60)",
                color: "var(--primary)",
              }}
            >
              More in {frontmatter.category}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
