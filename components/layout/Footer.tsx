"use client";

import Link from "next/link";
import { Suspense } from "react";

function IndiaFlagSmall() {
  return (
    <svg width="24" height="17" viewBox="0 0 80 56" aria-hidden="true">
      <rect x="0" y="0" width="80" height="18.67" fill="#FF9933" />
      <rect x="0" y="18.67" width="80" height="18.67" fill="#FFFFFF" />
      <rect x="0" y="37.33" width="80" height="18.67" fill="#138808" />
      <circle cx="40" cy="28" r="7" fill="none" stroke="#000080" strokeWidth="1.5" />
      <circle cx="40" cy="28" r="2" fill="#000080" />
    </svg>
  );
}

function FooterInner() {
  return (
    <footer
      className="mt-20 border-t"
      style={{
        borderColor: "var(--border)",
        background: "linear-gradient(to bottom, oklch(0.97 0.004 60), oklch(0.955 0.006 60))",
      }}
    >
      {/* Tricolor top border */}
      <div className="flex h-1 w-full">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <h3
              className="mb-3 flex items-center gap-2.5 text-lg font-extrabold"
              style={{ letterSpacing: "-0.02em" }}
            >
              <IndiaFlagSmall />
              Mai Bharat Bol Raha Hoon
            </h3>
            <p className="mb-4 max-w-xs text-sm leading-relaxed text-[var(--muted-foreground)]">
              Voice of India, Story of India
            </p>
            <div className="flex h-1 w-20 overflow-hidden rounded-full">
              <div className="flex-1 bg-[#FF9933]" />
              <div className="flex-1 border border-[var(--border)] bg-white" />
              <div className="flex-1 bg-[#138808]" />
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
              Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Mission column */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
              Mission
            </h4>
            <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
              The voice of India, reaching every Indian.
            </p>
          </div>
        </div>

        <div
          className="mt-10 border-t pt-5 text-center text-xs text-[var(--muted-foreground)]"
          style={{ borderColor: "oklch(0.89 0.01 60)" }}
        >
          &copy; {new Date().getFullYear()} Mai Bharat Bol Raha Hoon. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export function Footer() {
  return (
    <Suspense fallback={<div className="mt-20 h-40 border-t border-[var(--border)]" />}>
      <FooterInner />
    </Suspense>
  );
}
