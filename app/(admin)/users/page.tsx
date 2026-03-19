"use client";

import { useState, useEffect } from "react";

interface Admin {
  email: string;
  role: "super_admin" | "admin";
  name: string;
  source: "env" | "file";
}

export default function UsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function loadAdmins() {
    try {
      const res = await fetch("/api/admins");
      if (res.ok) setAdmins(await res.json());
    } catch {
      // empty
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAdmins(); }, []);

  async function handleAdd() {
    if (!newEmail.trim() || !newName.trim()) {
      setMessage({ type: "error", text: "Both email and name are required." });
      return;
    }
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail.trim(), name: newName.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to add admin." });
        return;
      }

      setAdmins((prev) => [...prev, data.admin]);
      setNewEmail("");
      setNewName("");
      setShowForm(false);
      setMessage({ type: "success", text: `Admin "${data.admin.name}" added. They can now sign in.` });
    } catch {
      setMessage({ type: "error", text: "Network error." });
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(email: string, name: string) {
    if (!confirm(`Remove admin access for "${name}" (${email})?`)) return;

    try {
      const res = await fetch(`/api/admins/${encodeURIComponent(email)}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to remove admin." });
        return;
      }

      setAdmins((prev) => prev.filter((a) => a.email !== email));
      setMessage({ type: "success", text: `Admin "${name}" removed.` });
    } catch {
      setMessage({ type: "error", text: "Network error." });
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            User Management
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Manage who can access the admin portal. Super Admin only.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Admin
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
          className="mb-6 rounded-2xl border bg-[var(--card)] p-5 shadow-sm"
          style={{ borderColor: "oklch(0.91 0.015 60)" }}
        >
          <h3 className="mb-4 text-sm font-bold">Add New Admin</h3>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Full name..."
              className="flex-1 rounded-xl border bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
              style={{ borderColor: "oklch(0.91 0.015 60)" }}
            />
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email address..."
              className="flex-1 rounded-xl border bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
              style={{ borderColor: "oklch(0.91 0.015 60)" }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                disabled={saving || !newEmail.trim() || !newName.trim()}
                className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
              >
                {saving ? "Adding..." : "Add"}
              </button>
              <button
                onClick={() => { setShowForm(false); setNewEmail(""); setNewName(""); }}
                className="rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:bg-[var(--muted)]"
                style={{ borderColor: "oklch(0.91 0.015 60)" }}
              >
                Cancel
              </button>
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--muted-foreground)]">
            The user will be able to sign in via Clerk and access the admin portal with the Admin role.
            Their article submissions will require Super Admin approval.
          </p>
        </div>
      )}

      {/* Info banner */}
      <div
        className="mb-6 rounded-xl border px-4 py-3 text-xs text-[var(--muted-foreground)]"
        style={{ borderColor: "oklch(0.91 0.015 60)", background: "oklch(0.985 0.004 60)" }}
      >
        <strong>How it works:</strong> Super Admins (from env vars) cannot be removed here.
        Admins added below are stored in <code className="rounded bg-[var(--muted)] px-1 py-0.5 text-[10px]">content/admins.json</code> and
        committed to GitHub. Only whitelisted emails can access the admin portal.
      </div>

      {/* Admins list */}
      <div
        className="overflow-hidden rounded-2xl border bg-[var(--card)] shadow-sm"
        style={{ borderColor: "oklch(0.91 0.015 60)" }}
      >
        {/* Table header */}
        <div
          className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]"
          style={{ borderColor: "oklch(0.93 0.008 60)" }}
        >
          <span>User</span>
          <span>Role</span>
          <span>Source</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <div className="space-y-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse border-b bg-[var(--muted)]/30" style={{ borderColor: "oklch(0.95 0.005 60)" }} />
            ))}
          </div>
        ) : admins.length > 0 ? (
          <div>
            {admins.map((admin) => (
              <div
                key={admin.email}
                className="group grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b px-6 py-3.5 transition-colors hover:bg-[var(--muted)]/50 last:border-b-0"
                style={{ borderColor: "oklch(0.95 0.005 60)" }}
              >
                {/* User info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{
                      background: admin.role === "super_admin" ? "oklch(0.52 0.22 25)" : "oklch(0.5 0.15 250)",
                    }}
                  >
                    {admin.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{admin.name}</p>
                    <p className="truncate text-xs text-[var(--muted-foreground)]">{admin.email}</p>
                  </div>
                </div>

                {/* Role badge */}
                <span
                  className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={
                    admin.role === "super_admin"
                      ? { background: "oklch(0.52 0.22 25 / 0.1)", color: "var(--primary)" }
                      : { background: "oklch(0.5 0.15 250 / 0.1)", color: "oklch(0.5 0.15 250)" }
                  }
                >
                  {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                </span>

                {/* Source */}
                <span className="shrink-0 text-xs text-[var(--muted-foreground)]">
                  {admin.source === "env" ? "ENV" : "Portal"}
                </span>

                {/* Actions */}
                <div className="text-right">
                  {admin.source === "file" ? (
                    <button
                      onClick={() => handleRemove(admin.email, admin.name)}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-500 opacity-0 transition-all hover:bg-red-50 group-hover:opacity-100"
                    >
                      Remove
                    </button>
                  ) : (
                    <span className="text-[10px] text-[var(--muted-foreground)]">
                      {admin.role === "super_admin" ? "Protected" : "ENV"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="mb-3 text-3xl opacity-30">👥</div>
            <p className="text-sm text-[var(--muted-foreground)]">No admins configured yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
