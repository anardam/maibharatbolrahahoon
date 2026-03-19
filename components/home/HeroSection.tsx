"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { ArticleFrontmatter } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { FeaturedArticleStack } from "./FeaturedArticleStack";
import { statesData } from "@/lib/states-data";

const IndiaMapInteractive = dynamic(
  () => import("./IndiaMapInteractive").then((mod) => ({ default: mod.IndiaMapInteractive })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[300px] items-center justify-center lg:min-h-[600px]">
        <div className="h-[250px] w-[220px] animate-pulse rounded-2xl bg-[var(--muted)] lg:h-[500px] lg:w-[430px]" />
      </div>
    ),
  }
);

interface HeroSectionProps {
  articles: ArticleFrontmatter[];
  locale: Locale;
  siteName: string;
  tagline: string;
  heroSubtitle: string;
}

export function HeroSection({
  articles,
  locale,
  siteName,
  tagline,
  heroSubtitle,
}: HeroSectionProps) {
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const hoveredState = hoveredStateId ? statesData[hoveredStateId] : null;

  return (
    <>
      {/* ===== MOBILE & TABLET (< lg) ===== */}
      <section className="mb-10 lg:hidden">
        {/* Map card — centered */}
        <div
          className="mx-auto max-w-md overflow-hidden rounded-2xl sm:max-w-lg"
          style={{
            background: "linear-gradient(145deg, oklch(0.98 0.012 60) 0%, oklch(1 0 0) 40%, oklch(0.98 0.008 80) 100%)",
            boxShadow: "0 12px 40px -8px oklch(0.52 0.22 25 / 0.15)",
          }}
        >
          {/* Tricolor top accent */}
          <div className="flex h-1 w-full">
            <div className="flex-1 bg-[#FF9933]" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-[#138808]" />
          </div>

          {/* Title — centered */}
          <div className="px-5 pt-5 text-center">
            <h1
              className="text-2xl font-extrabold tracking-tight text-[var(--foreground)]"
              style={{ letterSpacing: "-0.02em" }}
            >
              {siteName}
            </h1>
            <p className="mt-1 text-xs font-medium text-[var(--muted-foreground)]">
              {tagline} — {heroSubtitle}
            </p>
          </div>

          {/* Map — centered with constrained width */}
          <div className="relative px-4 pb-2">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                background: "radial-gradient(ellipse 80% 60% at 50% 55%, oklch(0.52 0.22 25 / 0.12) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />
            <div className="mx-auto max-w-[280px] sm:max-w-[360px]">
              <IndiaMapInteractive
                locale={locale}
                onStateHover={setHoveredStateId}
              />
            </div>
          </div>

          {/* Hovered state name — centered */}
          <div className="h-8 pb-3 text-center">
            {hoveredState ? (
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-[var(--primary)] animate-[fadeIn_150ms_ease-out]"
                style={{ background: "oklch(0.52 0.22 25 / 0.1)", border: "1px solid oklch(0.52 0.22 25 / 0.2)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                {hoveredState.name}
              </span>
            ) : (
              <span className="text-[10px] text-[var(--muted-foreground)]">
                Tap on states to explore
              </span>
            )}
          </div>
        </div>

        {/* Mobile article cards — centered below map */}
        {articles.length > 0 && (
          <div className="mx-auto mt-6 max-w-md sm:max-w-lg">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-5 w-1 rounded-full bg-[var(--primary)]" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                Latest News
              </h2>
            </div>
            <FeaturedArticleStack articles={articles.slice(0, 3)} locale={locale} />
          </div>
        )}
      </section>

      {/* ===== DESKTOP (lg+) ===== */}
      <section className="mb-14 hidden lg:block">
        <div
          className="rounded-3xl"
          style={{
            background: "linear-gradient(135deg, oklch(0.98 0.012 60) 0%, oklch(1 0 0) 40%, oklch(0.98 0.008 80) 100%)",
            boxShadow: "0 20px 60px -10px oklch(0.52 0.22 25 / 0.18), 0 4px 16px -4px oklch(0.52 0.22 25 / 0.1)",
          }}
        >
          {/* Tricolor top accent bar */}
          <div className="flex h-1 w-full overflow-hidden rounded-t-3xl">
            <div className="flex-1 bg-[#FF9933]" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-[#138808]" />
          </div>

          <div className="grid grid-cols-[1.4fr_0.6fr] gap-0">
            {/* Left: Map */}
            <div
              className="relative border-r p-6 pb-3"
              style={{ borderColor: "oklch(0.91 0.015 60)" }}
            >
              {/* Subtle radial glow behind map */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  background: "radial-gradient(ellipse 70% 60% at 50% 55%, oklch(0.52 0.22 25 / 0.12) 0%, transparent 70%)",
                }}
                aria-hidden="true"
              />

              {/* Title */}
              <div className="relative mb-3 text-center">
                <h1
                  className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {siteName}
                </h1>
                <p className="mt-1 text-sm font-medium text-[var(--muted-foreground)]">
                  {tagline}
                </p>
              </div>

              {/* Interactive map */}
              <IndiaMapInteractive
                locale={locale}
                onStateHover={setHoveredStateId}
              />

              {/* Hovered state name */}
              <div className="h-9 text-center">
                {hoveredState ? (
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-[var(--primary)] animate-[fadeIn_150ms_ease-out]"
                    style={{ background: "oklch(0.52 0.22 25 / 0.1)", border: "1px solid oklch(0.52 0.22 25 / 0.2)" }}
                  >
                    <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                    {hoveredState.name}
                  </span>
                ) : (
                  <span className="text-xs text-[var(--muted-foreground)]">
                    Hover over states to explore
                  </span>
                )}
              </div>
            </div>

            {/* Right: Featured articles */}
            <div
              className="flex flex-col p-6"
              style={{ background: "oklch(0.985 0.004 60)" }}
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="h-5 w-1 rounded-full bg-[var(--primary)]" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                  Latest News
                </h2>
              </div>
              {articles.length > 0 ? (
                <FeaturedArticleStack articles={articles.slice(0, 3)} locale={locale} />
              ) : (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-[var(--border)] p-8 text-center">
                  <div>
                    <div className="mb-3 text-3xl opacity-40">📰</div>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Articles will appear here once published
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
