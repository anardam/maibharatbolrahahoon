"use client";

import { useState } from "react";

export default function NewArticlePage() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSaveDraft() {
    setSaving(true);
    // TODO: Phase 4 — Call GitHub API to create branch + commit MDX file
    alert("Draft save will be connected to GitHub API in Phase 4");
    setSaving(false);
  }

  async function handleSubmitForReview() {
    setSaving(true);
    // TODO: Phase 4 — Create branch, commit, then create PR
    alert("Submit for review will create a GitHub PR in Phase 4");
    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-2xl font-bold">New Article</h1>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title..."
            className="border-default focus:ring-primary w-full rounded-lg border bg-transparent px-4 py-2.5 outline-none focus:ring-2"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief description..."
            rows={2}
            className="border-default focus:ring-primary w-full rounded-lg border bg-transparent px-4 py-2.5 outline-none focus:ring-2"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. politics, sports, tech..."
            className="border-default focus:ring-primary w-full rounded-lg border bg-transparent px-4 py-2.5 outline-none focus:ring-2"
          />
        </div>

        {/* YouTube URL */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            YouTube URL (optional)
          </label>
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="border-default focus:ring-primary w-full rounded-lg border bg-transparent px-4 py-2.5 outline-none focus:ring-2"
          />
        </div>

        {/* Content */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Content</label>
          {/* TODO: Replace with Tesserix RichTextEditor in Phase 3 */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article content here..."
            rows={12}
            className="border-default focus:ring-primary w-full rounded-lg border bg-transparent px-4 py-2.5 font-mono text-sm outline-none focus:ring-2"
          />
          <p className="text-muted mt-1 text-xs">
            Rich text editor (Tesserix RichTextEditor) will be integrated in
            Phase 3.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSaveDraft}
            disabled={saving || !title}
            className="border-default rounded-lg border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            💾 Save Draft
          </button>
          <button
            onClick={handleSubmitForReview}
            disabled={saving || !title || !content}
            className="bg-primary text-primary-foreground rounded-lg px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            📤 Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
}
