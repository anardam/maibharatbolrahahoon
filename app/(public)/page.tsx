import { getPublishedArticles, getCategories } from "@/lib/content";
import { ArticlesSection } from "@/components/article/ArticlesSection";
import { HeroSection } from "@/components/home/HeroSection";
import Link from "next/link";

export default async function HomePage() {
  const articles = getPublishedArticles();
  const categories = getCategories();

  return (
    <div>
      {/* Hero: Interactive India Map + Featured Articles */}
      <HeroSection
        articles={articles.map((a) => a.frontmatter)}
        locale="en"
        siteName="Mai Bharat Bol Raha Hoon"
        tagline="Voice of India, Story of India"
        heroSubtitle="News, Stories & Videos"
      />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mb-12">
          <div className="mb-5 flex items-center gap-4">
            <div className="h-px flex-1" style={{ background: "linear-gradient(to right, var(--border), transparent)" }} />
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">
              Categories
            </h2>
            <div className="h-px flex-1" style={{ background: "linear-gradient(to left, var(--border), transparent)" }} />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="category-pill rounded-full border px-5 py-2 text-sm font-semibold shadow-sm hover:shadow-md"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Articles — magazine-style layout */}
      {articles.length > 0 ? (
        <ArticlesSection
          articles={articles}
          locale="en"
          totalCount={articles.length}
          translations={{
            latestArticles: "Latest Articles",
            readMore: "Read more",
          }}
        />
      ) : (
        <section className="rounded-2xl border border-dashed border-[var(--border)] py-24 text-center">
          <div className="mb-4 text-4xl opacity-40">📰</div>
          <p className="text-lg text-[var(--muted-foreground)]">No articles published yet.</p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">Articles will appear here once published.</p>
        </section>
      )}
    </div>
  );
}
