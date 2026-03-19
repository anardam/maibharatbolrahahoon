"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Locale } from "@/lib/i18n";

export function LanguageSelector({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const switchLocale = useCallback(
    (newLocale: Locale) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("lang", newLocale);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, searchParams, router]
  );

  return (
    <div
      role="group"
      aria-label="भाषा चुनें / Select language"
      className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--muted)] p-0.5"
    >
      <button
        onClick={() => switchLocale("hi")}
        aria-pressed={locale === "hi"}
        aria-label="हिंदी में देखें"
        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
          locale === "hi"
            ? "bg-[var(--primary)] text-white shadow-sm"
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        }`}
      >
        हिं
      </button>
      <button
        onClick={() => switchLocale("en")}
        aria-pressed={locale === "en"}
        aria-label="View in English"
        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
          locale === "en"
            ? "bg-[var(--primary)] text-white shadow-sm"
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        }`}
      >
        EN
      </button>
    </div>
  );
}
