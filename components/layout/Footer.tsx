"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/i18n";

function FooterInner() {
  const searchParams = useSearchParams();
  const locale = (searchParams.get("lang") as Locale) || "hi";
  const t = getTranslations(locale);

  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold">🇮🇳 {t.siteName}</h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{t.tagline}</p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/" className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]">
              {t.home}
            </Link>
            <Link href="/search" className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]">
              {t.search}
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-[var(--border)] pt-4 text-center text-xs text-[var(--muted-foreground)]">
          &copy; {new Date().getFullYear()} {t.siteName}. {t.allRights}
        </div>
      </div>
    </footer>
  );
}

export function Footer() {
  return (
    <Suspense fallback={<div className="mt-16 h-32 border-t border-[var(--border)]" />}>
      <FooterInner />
    </Suspense>
  );
}
