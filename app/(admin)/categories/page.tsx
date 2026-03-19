"use client";

import { useState, useEffect } from "react";

interface Category {
  name: string;
  slug: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function loadCategories() {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) setCategories(await res.json());
    } catch {
      // empty
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCategories(); }, []);

  async function handleAdd() {
    if (!newName.trim()) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to add category." });
        return;
      }

      setCategories((prev) => [...prev, data.category]);
      setNewName("");
      setShowForm(false);
      setMessage({ type: "success", text: `Category "${data.category.name}" added.` });
    } catch {
      setMessage({ type: "error", text: "Network error." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug: string, name: string) {
    if (!confirm(`Delete category "${name}"?`)) return;

    try {
      const res = await fetch(`/api/categories/${slug}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to delete." });
        return;
      }

      setCategories((prev) => prev.filter((c) => c.slug !== slug));
      setMessage({ type: "success", text: `Category "${name}" deleted.` });
    } catch {
      setMessage({ type: "error", text: "Network error." });
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            Categories
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Manage content categories. Super Admin only.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div
          className="mb-6 rounded-xl border px-4 py-3 text-sm font-medium"
          style={
            message.type === "error"
              ? { background: "oklch(0.55 0.2 25 / 0.08)", borderColor: "oklch(0.55 0.2 25 / 0.2)", color: "oklch(0.55 0.2 25)" }
              : { background: "oklch(0.45 0.15 145 / 0.08)", borderColor: "oklch(0.45 0.15 145 / 0.2)", color: "oklch(0.4 0.15 145)" }
          }
        >
          {message.text}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div
          className="mb-6 flex items-center gap-3 rounded-2xl border bg-[var(--card)] p-4 shadow-sm"
          style={{ borderColor: "oklch(0.91 0.015 60)" }}
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name..."
            className="flex-1 rounded-xl border bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
            style={{ borderColor: "oklch(0.91 0.015 60)" }}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button
            onClick={handleAdd}
            disabled={saving || !newName.trim()}
            className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
          >
            {saving ? "Adding..." : "Add"}
          </button>
          <button
            onClick={() => { setShowForm(false); setNewName(""); }}
            className="rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:bg-[var(--muted)]"
            style={{ borderColor: "oklch(0.91 0.015 60)" }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Categories list */}
      <div
        className="overflow-hidden rounded-2xl border bg-[var(--card)] shadow-sm"
        style={{ borderColor: "oklch(0.91 0.015 60)" }}
      >
        {loading ? (
          <div className="space-y-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse border-b bg-[var(--muted)]/30" style={{ borderColor: "oklch(0.95 0.005 60)" }} />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div>
            {categories.map((cat, i) => (
              <div
                key={cat.slug}
                className="group flex items-center justify-between border-b px-6 py-4 transition-colors hover:bg-[var(--muted)]/50 last:border-b-0"
                style={{ borderColor: "oklch(0.95 0.005 60)" }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                    style={{ background: `oklch(${0.5 + (i % 3) * 0.05} 0.18 ${25 + i * 20})` }}
                  >
                    {cat.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{cat.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">/{cat.slug}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(cat.slug, cat.name)}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-500 opacity-0 transition-all hover:bg-red-50 group-hover:opacity-100"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="mb-3 text-3xl opacity-30">📁</div>
            <p className="text-sm text-[var(--muted-foreground)]">No categories yet. Add your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
