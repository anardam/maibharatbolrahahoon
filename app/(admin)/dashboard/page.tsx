import Link from "next/link";
import { getAllArticles } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const articles = getAllArticles();
  const published = articles.filter((a) => a.frontmatter.status === "published");
  const drafts = articles.filter((a) => a.frontmatter.status === "draft");
  const inReview = articles.filter((a) => a.frontmatter.status === "review");

  const stats = [
    { label: "Total Articles", value: articles.length, icon: "📝", color: "oklch(0.52 0.22 25)" },
    { label: "Published", value: published.length, icon: "✅", color: "oklch(0.45 0.15 145)" },
    { label: "In Review", value: inReview.length, icon: "⏳", color: "oklch(0.55 0.15 65)" },
    { label: "Drafts", value: drafts.length, icon: "📄", color: "oklch(0.5 0.02 250)" },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Overview of your content and activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl border bg-[var(--card)] p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            style={{ borderColor: "oklch(0.91 0.015 60)" }}
          >
            {/* Accent top line */}
            <div
              className="absolute left-0 top-0 h-1 w-full opacity-80"
              style={{ background: stat.color }}
              aria-hidden="true"
            />
            <div className="mb-3 flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ background: `color-mix(in oklch, ${stat.color} 10%, white)`, color: stat.color }}
              >
                {stat.label}
              </span>
            </div>
            <p className="text-3xl font-extrabold tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Articles */}
      <div
        className="overflow-hidden rounded-2xl border bg-[var(--card)] shadow-sm"
        style={{ borderColor: "oklch(0.91 0.015 60)" }}
      >
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: "oklch(0.93 0.008 60)" }}
        >
          <div className="flex items-center gap-3">
            <div className="h-5 w-1 rounded-full bg-[var(--primary)]" aria-hidden="true" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
              Recent Articles
            </h2>
          </div>
          <Link
            href="/articles"
            className="text-xs font-semibold text-[var(--primary)] transition-colors hover:text-[var(--foreground)]"
          >
            View all →
          </Link>
        </div>

        {articles.length > 0 ? (
          <div>
            {articles.slice(0, 5).map((article, i) => (
              <div
                key={article.frontmatter.slug}
                className="flex items-center justify-between border-b px-6 py-3.5 transition-colors hover:bg-[var(--muted)]/50 last:border-b-0"
                style={{ borderColor: "oklch(0.95 0.005 60)", animationDelay: `${i * 50}ms` }}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{article.frontmatter.title}</p>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                    <span>{article.frontmatter.category}</span>
                    <span>•</span>
                    <span>{formatDate(article.frontmatter.createdAt)}</span>
                  </div>
                </div>
                <span
                  className="ml-4 shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                  style={
                    article.frontmatter.status === "published"
                      ? { background: "var(--status-published-bg)", color: "var(--status-published-text)" }
                      : article.frontmatter.status === "review"
                        ? { background: "var(--status-review-bg)", color: "var(--status-review-text)" }
                        : { background: "var(--status-draft-bg)", color: "var(--status-draft-text)" }
                  }
                >
                  {article.frontmatter.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="mb-3 text-3xl opacity-30">📝</div>
            <p className="text-sm text-[var(--muted-foreground)]">No articles yet.</p>
            <Link
              href="/articles/new"
              className="mt-3 inline-block text-sm font-semibold text-[var(--primary)] hover:underline"
            >
              Create your first article →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
