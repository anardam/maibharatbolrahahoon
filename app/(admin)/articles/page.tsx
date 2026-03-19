import Link from "next/link";
import { getAllArticles } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            Articles
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Manage all your content in one place.
          </p>
        </div>
        <Link
          href="/articles/new"
          className="group flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Article
        </Link>
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-2xl border bg-[var(--card)] shadow-sm"
        style={{ borderColor: "oklch(0.91 0.015 60)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr
                className="border-b text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]"
                style={{ borderColor: "oklch(0.93 0.008 60)" }}
              >
                <th className="px-5 py-3.5">Title</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.length > 0 ? (
                articles.map((article) => (
                  <tr
                    key={article.frontmatter.slug}
                    className="border-b transition-colors hover:bg-[var(--muted)]/50 last:border-b-0"
                    style={{ borderColor: "oklch(0.95 0.005 60)" }}
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-semibold">{article.frontmatter.title}</p>
                      <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                        By {article.frontmatter.author}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          background: "oklch(0.52 0.22 25 / 0.08)",
                          color: "var(--primary)",
                        }}
                      >
                        {article.frontmatter.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
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
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[var(--muted-foreground)]">
                      {formatDate(article.frontmatter.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/articles/${article.frontmatter.slug}`}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/10"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/article/${article.frontmatter.slug}`}
                          target="_blank"
                          className="rounded-lg px-2 py-1.5 text-xs text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                        >
                          View ↗
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="mb-3 text-3xl opacity-30">📝</div>
                    <p className="text-sm text-[var(--muted-foreground)]">No articles yet.</p>
                    <Link
                      href="/articles/new"
                      className="mt-2 inline-block text-sm font-semibold text-[var(--primary)] hover:underline"
                    >
                      Create your first article →
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
