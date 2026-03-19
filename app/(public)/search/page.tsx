"use client";

import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">Search</h1>

      <div className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="border-default focus:ring-primary w-full rounded-xl border bg-transparent px-4 py-3 pl-12 text-lg outline-none focus:ring-2"
        />
        <svg
          className="text-muted absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Pagefind integration will be added in Phase 5 */}
      <p className="text-muted text-center text-sm">
        Search powered by Pagefind — coming soon.
      </p>
    </div>
  );
}
