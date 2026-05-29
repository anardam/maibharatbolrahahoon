"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RichTextEditor = lazy(() => import("@/components/editor/RichTextEditor"));

interface StatusMessage {
  type: "success" | "error" | "info";
  text: string;
  prUrl?: string;
}

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [region, setRegion] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<StatusMessage | null>(null);
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  async function handleSubmit() {
    if (!title || !excerpt || !content || !category) {
      setMessage({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          category,
          coverImage,
          region,
          youtubeUrls: youtubeUrl ? [youtubeUrl] : [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to create article." });
        return;
      }

      if (data.mode === "direct") {
        setMessage({ type: "success", text: "Article published successfully!" });
      } else {
        setMessage({
          type: "success",
          text: "Article submitted for review. A Super Admin will review it.",
          prUrl: data.prUrl,
        });
      }

      // Reset form after success
      setTimeout(() => router.push("/articles"), 2000);
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
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
          New Article
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Fill in the details below. Super Admins publish directly; Admins submit for review.
        </p>
      </div>

      {/* Status message */}
      {message && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 rounded-xl border px-4 py-3 text-sm"
          style={
            message.type === "error"
              ? { background: "oklch(0.55 0.2 25 / 0.08)", borderColor: "oklch(0.55 0.2 25 / 0.2)", color: "oklch(0.55 0.2 25)" }
              : message.type === "success"
                ? { background: "oklch(0.45 0.15 145 / 0.08)", borderColor: "oklch(0.45 0.15 145 / 0.2)", color: "oklch(0.4 0.15 145)" }
                : { background: "oklch(0.52 0.22 25 / 0.08)", borderColor: "oklch(0.52 0.22 25 / 0.2)", color: "oklch(0.52 0.22 25)" }
          }
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{message.text}</span>
            <button onClick={() => setMessage(null)} aria-label="Dismiss" className="ml-4 rounded p-1 hover:opacity-70">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {message.prUrl && (
            <a href={message.prUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs underline">
              View PR on GitHub →
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
            <label htmlFor="title" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
              Title <span className="text-[var(--primary)]">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title..."
              className="w-full rounded-xl border bg-transparent px-4 py-3 text-base outline-none transition-shadow focus:ring-2 focus:ring-[var(--ring)]"
              style={{ borderColor: "oklch(0.91 0.015 60)" }}
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
              Excerpt <span className="text-[var(--primary)]">*</span>
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description..."
              rows={2}
              className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--ring)]"
              style={{ borderColor: "oklch(0.91 0.015 60)" }}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                Category <span className="text-[var(--primary)]">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--ring)]"
                style={{ borderColor: "oklch(0.91 0.015 60)" }}
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="region" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                Region <span className="text-[var(--muted-foreground)] normal-case tracking-normal">(optional)</span>
              </label>
              <input
                id="region"
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g. IN-MH, IN-KA..."
                className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--ring)]"
                style={{ borderColor: "oklch(0.91 0.015 60)" }}
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="coverImage" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                Cover Image URL <span className="text-[var(--muted-foreground)] normal-case tracking-normal">(optional)</span>
              </label>
              <input
                id="coverImage"
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--ring)]"
                style={{ borderColor: "oklch(0.91 0.015 60)" }}
              />
            </div>
            <div>
              <label htmlFor="youtube" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                YouTube URL <span className="text-[var(--muted-foreground)] normal-case tracking-normal">(optional)</span>
              </label>
              <input
                id="youtube"
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--ring)]"
                style={{ borderColor: "oklch(0.91 0.015 60)" }}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
              Content <span className="text-[var(--primary)]">*</span>
            </label>
            <Suspense fallback={<div className="h-[350px] animate-pulse rounded-xl bg-[var(--muted)]" />}>
              <RichTextEditor value={content} onChange={setContent} />
            </Suspense>
          </div>
        </div>

        {/* Action bar */}
        <div
          className="flex items-center justify-end gap-3 border-t px-6 py-4 sm:px-8"
          style={{ borderColor: "oklch(0.93 0.008 60)", background: "oklch(0.985 0.004 60)" }}
        >
          <Link
            href="/articles"
            className="rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all hover:bg-[var(--muted)]"
            style={{ borderColor: "oklch(0.91 0.015 60)" }}
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saving || !title || !content || !category}
            className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md disabled:opacity-40"
          >
            {saving ? "Submitting..." : "Submit Article"}
          </button>
        </div>
      </div>
    </div>
  );
}
