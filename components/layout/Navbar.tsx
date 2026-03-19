"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Show, UserButton } from "@clerk/nextjs";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import type { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/i18n";

function NavbarInner() {
  const searchParams = useSearchParams();
  const locale = (searchParams.get("lang") as Locale) || "hi";
  const t = getTranslations(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <span className="text-2xl">🇮🇳</span>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight tracking-tight">
              {t.siteName}
            </span>
            <span className="hidden text-[10px] leading-tight text-[var(--muted-foreground)] sm:block">
              {t.tagline}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="rounded-full p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label={t.search}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>

          <LanguageSelector locale={locale} />

          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="rounded-full bg-[var(--primary)] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
            >
              {t.admin}
            </Link>
            <UserButton />
          </Show>
        </div>
      </nav>
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<div className="h-14 border-b border-[var(--border)]" />}>
      <NavbarInner />
    </Suspense>
  );
}
