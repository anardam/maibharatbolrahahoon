import Link from "next/link";

interface PaginationProps {
  basePath: string;
  page: number;
  totalPages: number;
}

export function Pagination({ basePath, page, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;
  const href = (p: number) => (p === 1 ? basePath : `${basePath}${basePath.includes("?") ? "&" : "?"}page=${p}`);
  const linkClass =
    "rounded-full border px-5 py-2 text-sm font-semibold transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-4">
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" className={linkClass} style={{ borderColor: "oklch(0.91 0.015 60)" }}>
          ← Newer
        </Link>
      ) : null}
      <span className="text-sm text-[var(--muted-foreground)]" aria-current="page">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={href(page + 1)} rel="next" className={linkClass} style={{ borderColor: "oklch(0.91 0.015 60)" }}>
          Older →
        </Link>
      ) : null}
    </nav>
  );
}
