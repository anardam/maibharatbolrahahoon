"use client";

import { useState } from "react";
import Link from "next/link";

const suggestedCategories = [
  { name: "Politics", slug: "politics" },
  { name: "Sports", slug: "sports" },
  { name: "Technology", slug: "technology" },
  { name: "Entertainment", slug: "entertainment" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">Search</h1>

      <div className="relative mb-8">
        <label htmlFor="search-input" className="sr-only">
          Search articles
        </label>
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="border-default w-full rounded-xl border bg-transparent px-4 py-3 pl-12 text-lg outline-none focus:ring-2 focus:ring-[var(--ring)]"
        />
        <svg
          className="text-muted absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Suggested categories as fallback */}
      <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center">
        <p className="text-muted mb-4 text-sm">
          Search powered by Pagefind — coming soon.
        </p>
        <p className="mb-4 text-sm font-medium">Browse by category:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestedCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-1.5 text-sm font-medium shadow-sm transition-all hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
