"use client";

import { useState, useEffect } from "react";

interface PR {
  number: number;
  title: string;
  body: string;
  html_url: string;
  user: { login: string; avatar_url: string };
  head: { ref: string };
  created_at: string;
}

export default function ReviewPage() {
  const [prs, setPrs] = useState<PR[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function loadPRs() {
    try {
      const res = await fetch("/api/review");
      if (res.ok) {
        setPrs(await res.json());
      }
    } catch {
      // Silently handle — empty state will show
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPRs(); }, []);

  async function handleAction(prNumber: number, action: "merge" | "reject") {
    setActionLoading(prNumber);
    setMessage(null);

    try {
      const res = await fetch(`/api/review/${prNumber}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          comment: action === "reject" ? "Rejected by Super Admin." : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Action failed." });
        return;
      }

      setMessage({ type: "success", text: data.message });
      setPrs((prev) => prev.filter((pr) => pr.number !== prNumber));
    } catch {
      setMessage({ type: "error", text: "Network error." });
    } finally {
      setActionLoading(null);
    }
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
          Review Queue
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Approve or reject pending article submissions.
        </p>
      </div>

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

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-[var(--muted)]" />
          ))}
        </div>
      ) : prs.length > 0 ? (
        <div className="space-y-4">
          {prs.map((pr) => (
            <div
              key={pr.number}
              className="overflow-hidden rounded-2xl border bg-[var(--card)] shadow-sm"
              style={{ borderColor: "oklch(0.91 0.015 60)" }}
            >
              <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold">{pr.title}</h3>
                    <div className="mt-1 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                      <span>#{pr.number}</span>
                      <span>•</span>
                      <span>by {pr.user.login}</span>
                      <span>•</span>
                      <span>{timeAgo(pr.created_at)}</span>
                    </div>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: "var(--status-review-bg)", color: "var(--status-review-text)" }}
                  >
                    Pending
                  </span>
                </div>

                {pr.body && (
                  <p className="mb-4 text-sm text-[var(--muted-foreground)]">{pr.body.slice(0, 200)}</p>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAction(pr.number, "merge")}
                    disabled={actionLoading === pr.number}
                    className="rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md disabled:opacity-40"
                    style={{ background: "oklch(0.45 0.15 145)" }}
                  >
                    {actionLoading === pr.number ? "..." : "Approve & Publish"}
                  </button>
                  <button
                    onClick={() => handleAction(pr.number, "reject")}
                    disabled={actionLoading === pr.number}
                    className="rounded-xl border px-4 py-2 text-xs font-bold text-red-600 transition-all hover:bg-red-50 disabled:opacity-40"
                    style={{ borderColor: "oklch(0.55 0.2 25 / 0.3)" }}
                  >
                    Reject
                  </button>
                  <a
                    href={pr.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]"
                  >
                    View on GitHub →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="overflow-hidden rounded-2xl border bg-[var(--card)] shadow-sm"
          style={{ borderColor: "oklch(0.91 0.015 60)" }}
        >
          <div className="px-6 py-20 text-center">
            <div
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: "oklch(0.52 0.22 25 / 0.08)" }}
            >
              <span className="text-2xl">✅</span>
            </div>
            <h2 className="mb-2 text-lg font-bold">All caught up!</h2>
            <p className="mx-auto max-w-sm text-sm text-[var(--muted-foreground)]">
              No pending articles to review. New submissions will appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
