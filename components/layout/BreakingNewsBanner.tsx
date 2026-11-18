import Link from "next/link";
import { getBreakingNews } from "@/lib/content";

// Toggle via content/breaking.json — { "active": true, "text": "...", "url": "/article/..." }
export function BreakingNewsBanner() {
  const news = getBreakingNews();
  if (!news) return null;

  const body = (
    <>
      <span className="mr-3 rounded bg-white px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-widest text-[var(--primary)]">
        Breaking
      </span>
      <span className="font-semibold">{news.text}</span>
    </>
  );

  return (
    <div role="region" aria-label="Breaking news" className="bg-[var(--primary)] px-4 py-2 text-center text-sm text-white">
      {news.url ? (
        <Link href={news.url} className="underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-white">
          {body}
        </Link>
      ) : (
        body
      )}
    </div>
  );
}
