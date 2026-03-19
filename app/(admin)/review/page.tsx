export default function ReviewPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Review Queue</h1>
      <p className="text-muted mb-4 text-sm">
        Super Admin only — review and approve pending articles (GitHub PRs).
      </p>

      <div className="bg-card border-default rounded-xl border p-12 text-center shadow-sm">
        <p className="text-4xl mb-4">✅</p>
        <p className="text-muted">
          Review queue will show open GitHub PRs for content approval.
        </p>
        <p className="text-muted mt-1 text-sm">
          Coming in Phase 4 — GitOps workflow integration.
        </p>
      </div>
    </div>
  );
}
