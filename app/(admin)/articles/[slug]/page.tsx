"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface StatusMessage {
  type: "success" | "error" | "info";
  text: string;
  prUrl?: string;
}

export default function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [region, setRegion] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<StatusMessage | null>(null);
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/articles/${slug}`).then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([article, cats]) => {
      if (article.frontmatter) {
        setTitle(article.frontmatter.title || "");
        setExcerpt(article.frontmatter.excerpt || "");
        setCategory(article.frontmatter.category || "");
        setCoverImage(article.frontmatter.coverImage || "");
        setRegion(article.frontmatter.region || "");
        setYoutubeUrl(article.frontmatter.youtubeUrls?.[0] || "");
        setContent(article.content || "");
      }
      setCategories(cats);
      setLoading(false);
    }).catch(() => {
      setMessage({ type: "error", text: "Failed to load article." });
      setLoading(false);
    });
  }, [slug]);

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/articles/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, excerpt, content, category, coverImage, region,
          youtubeUrls: youtubeUrl ? [youtubeUrl] : [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to update." });
        return;
      }

      setMessage({
        type: "success",
        text: data.mode === "direct" ? "Article updated!" : "Changes submitted for review.",
        prUrl: data.prUrl,
      });
    } catch {
      setMessage({ type: "error", text: "Network error." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this article? This cannot be undone.")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/articles/${slug}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to delete." });
        return;
      }

      setMessage({ type: "success", text: "Article deleted." });
      setTimeout(() => router.push("/articles"), 1500);
    } catch {
      setMessage({ type: "error", text: "Network error." });
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-[var(--muted)]" />
        <div className="mt-6 h-[600px] animate-pulse rounded-2xl bg-[var(--muted)]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/articles"
          className="group mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]"
        >
          <svg className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Articles
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
          Edit Article
        </h1>
      </div>

      {/* Status message */}
      {message && (
        <div
          role="status"
          className="mb-6 rounded-xl border px-4 py-3 text-sm"
          style={
            message.type === "error"
              ? { background: "oklch(0.55 0.2 25 / 0.08)", borderColor: "oklch(0.55 0.2 25 / 0.2)", color: "oklch(0.55 0.2 25)" }
              : { background: "oklch(0.45 0.15 145 / 0.08)", borderColor: "oklch(0.45 0.15 145 / 0.2)", color: "oklch(0.4 0.15 145)" }
          }
        >
          <span className="font-medium">{message.text}</span>
          {message.prUrl && (
            <a href={message.prUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs underline">
              View PR →
            </a>
          )}
        </div>
      )}

      {/* Form */}
      <div
        className="overflow-hidden rounded-2xl border bg-[var(--card)] shadow-sm"
        style={{ borderColor: "oklch(0.91 0.015 60)" }}
      >
        <div className="space-y-6 p-6 sm:p-8">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Title</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border bg-transparent px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[var(--ring)]"
              style={{ borderColor: "oklch(0.91 0.015 60)" }} />
          </div>

          <div>
            <label htmlFor="excerpt" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Excerpt</label>
            <textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2}
              className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
              style={{ borderColor: "oklch(0.91 0.015 60)" }} />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Category</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
                style={{ borderColor: "oklch(0.91 0.015 60)" }}>
                <option value="">Select...</option>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="region" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Region</label>
              <input id="region" type="text" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. IN-MH"
                className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
                style={{ borderColor: "oklch(0.91 0.015 60)" }} />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="coverImage" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Cover Image URL</label>
              <input id="coverImage" type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)}
                className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
                style={{ borderColor: "oklch(0.91 0.015 60)" }} />
            </div>
            <div>
              <label htmlFor="youtube" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">YouTube URL</label>
              <input id="youtube" type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
                style={{ borderColor: "oklch(0.91 0.015 60)" }} />
            </div>
          </div>

          <div>
            <label htmlFor="content" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Content</label>
            <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={14}
              className="w-full rounded-xl border bg-transparent px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
              style={{ borderColor: "oklch(0.91 0.015 60)" }} />
          </div>
        </div>

        {/* Action bar */}
        <div
          className="flex items-center justify-between border-t px-6 py-4 sm:px-8"
          style={{ borderColor: "oklch(0.93 0.008 60)", background: "oklch(0.985 0.004 60)" }}
        >
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl border px-4 py-2 text-xs font-semibold text-red-600 transition-all hover:bg-red-50 disabled:opacity-40"
            style={{ borderColor: "oklch(0.55 0.2 25 / 0.3)" }}
          >
            {deleting ? "Deleting..." : "Delete Article"}
          </button>
          <div className="flex gap-3">
            <Link href="/articles"
              className="rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all hover:bg-[var(--muted)]"
              style={{ borderColor: "oklch(0.91 0.015 60)" }}>
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={saving || !title || !content}
              className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md disabled:opacity-40"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
