import Link from "next/link";
import { getAllArticles } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Articles</h1>
        <Link
          href="/articles/new"
          className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
        >
          + New Article
        </Link>
      </div>

      <div className="bg-card border-default overflow-hidden rounded-xl border shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-default border-b">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {articles.length > 0 ? (
              articles.map((article) => (
                <tr key={article.frontmatter.slug} className="hover:bg-accent/50">
                  <td className="px-4 py-3 font-medium">
                    {article.frontmatter.title}
                  </td>
                  <td className="text-muted px-4 py-3">
                    {article.frontmatter.category}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        article.frontmatter.status === "published"
                          ? "bg-green-100 text-green-700"
                          : article.frontmatter.status === "review"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {article.frontmatter.status}
                    </span>
                  </td>
                  <td className="text-muted px-4 py-3">
                    {formatDate(article.frontmatter.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/articles/${article.frontmatter.slug}`}
                      className="text-primary text-sm hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-muted px-4 py-12 text-center">
                  No articles yet. Click &quot;+ New Article&quot; to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
