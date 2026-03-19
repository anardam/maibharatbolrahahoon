"use client";

import Link from "next/link";
import { Suspense } from "react";
import { Show, UserButton } from "@clerk/nextjs";
import { getTranslations } from "@/lib/i18n";

function IndiaFlagSmall() {
  return (
    <svg width="28" height="20" viewBox="0 0 80 56" aria-hidden="true" className="drop-shadow-sm">
      <rect x="0" y="0" width="80" height="18.67" fill="#FF9933" />
      <rect x="0" y="18.67" width="80" height="18.67" fill="#FFFFFF" />
      <rect x="0" y="37.33" width="80" height="18.67" fill="#138808" />
      <circle cx="40" cy="28" r="7" fill="none" stroke="#000080" strokeWidth="1.5" />
      <circle cx="40" cy="28" r="2" fill="#000080" />
    </svg>
  );
}

function NavbarInner() {
  const t = getTranslations("en");

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--border)] backdrop-blur-xl"
      style={{
        background: "oklch(1 0 0 / 0.92)",
        boxShadow: "0 1px 0 0 oklch(0.91 0.01 80)",
      }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <IndiaFlagSmall />
          <div className="flex flex-col">
            <span
              className="text-[17px] font-extrabold leading-tight"
              style={{ letterSpacing: "-0.025em" }}
            >
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
            aria-label="Search"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>

          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="hidden rounded-full bg-[var(--primary)] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md sm:inline-block"
            >
              Admin
            </Link>
            <UserButton />
          </Show>
        </div>
      </nav>

      {/* Tricolor bottom accent */}
      <div className="flex h-[3px] w-full">
        <div className="flex-1" style={{ background: "#FF9933" }} />
        <div className="flex-1 bg-white" />
        <div className="flex-1" style={{ background: "#138808" }} />
      </div>
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
