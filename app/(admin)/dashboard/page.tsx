import { getAllArticles } from "@/lib/content";

export default function DashboardPage() {
  const articles = getAllArticles();
  const published = articles.filter((a) => a.frontmatter.status === "published");
  const drafts = articles.filter((a) => a.frontmatter.status === "draft");
  const inReview = articles.filter((a) => a.frontmatter.status === "review");

  const stats = [
    { label: "Total Articles", value: articles.length, icon: "📝" },
    { label: "Published", value: published.length, icon: "✅" },
    { label: "In Review", value: inReview.length, icon: "⏳" },
    { label: "Drafts", value: drafts.length, icon: "📄" },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border-default rounded-xl border p-6 shadow-sm"
          >
            <div className="mb-2 text-2xl">{stat.icon}</div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-muted text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Articles */}
      <div className="bg-card border-default rounded-xl border p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Recent Articles</h2>
        {articles.length > 0 ? (
          <div className="divide-y">
            {articles.slice(0, 5).map((article) => (
              <div
                key={article.frontmatter.slug}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-medium">{article.frontmatter.title}</p>
                  <p className="text-muted text-sm">
                    {article.frontmatter.category}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    article.frontmatter.status === "published"
                      ? "bg-green-100 text-green-700"
                      : article.frontmatter.status === "review"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {article.frontmatter.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted py-8 text-center text-sm">
            No articles yet. Create your first one!
          </p>
        )}
      </div>
    </div>
  );
}
