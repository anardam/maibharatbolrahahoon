import { notFound } from "next/navigation";
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

  return (
    <article className="mx-auto max-w-3xl">
      {/* Header */}
      <header className="mb-8">
        <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium">
          {frontmatter.category}
        </span>
        <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">
          {frontmatter.title}
        </h1>
        <p className="text-muted mb-4 text-lg">{frontmatter.excerpt}</p>
        <div className="text-muted flex items-center gap-4 text-sm">
          <span>{frontmatter.author}</span>
          <span>•</span>
          <time>
            {frontmatter.publishedAt
              ? formatDate(frontmatter.publishedAt)
              : formatDate(frontmatter.createdAt)}
          </time>
        </div>
      </header>

      {/* YouTube Videos */}
      {frontmatter.youtubeUrls?.map((url, i) => (
        <YouTubeEmbed key={i} url={url} title={frontmatter.title} />
      ))}

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        {/* MDX content will be rendered here in Phase 2 */}
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </article>
  );
}
