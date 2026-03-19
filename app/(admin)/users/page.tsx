export default function UsersPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">User Management</h1>
      <p className="text-muted mb-4 text-sm">
        Super Admin only — manage admin users via Clerk.
      </p>

      <div className="bg-card border-default rounded-xl border p-12 text-center shadow-sm">
        <p className="text-4xl mb-4">👥</p>
        <p className="text-muted">
          User management is handled through Clerk Dashboard.
        </p>
        <a
          href="https://dashboard.clerk.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary mt-2 inline-block text-sm hover:underline"
        >
          Open Clerk Dashboard →
        </a>
      </div>
    </div>
  );
}
