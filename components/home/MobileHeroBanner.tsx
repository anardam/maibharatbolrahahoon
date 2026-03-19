"use client";

interface MobileHeroBannerProps {
  siteName: string;
  tagline: string;
  heroSubtitle: string;
}

export function MobileHeroBanner({ siteName, tagline, heroSubtitle }: MobileHeroBannerProps) {
  return (
    <section
      className="relative mb-10 overflow-hidden rounded-2xl px-5 py-14 text-center text-white"
      style={{
        background: "linear-gradient(145deg, oklch(0.48 0.24 22) 0%, oklch(0.52 0.22 25) 45%, oklch(0.56 0.18 35) 100%)",
        boxShadow: "0 16px 40px -8px oklch(0.52 0.22 25 / 0.35)",
      }}
    >
      {/* Decorative concentric circles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
          style={{ width: "120%", aspectRatio: "1" }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
          style={{ width: "80%", aspectRatio: "1" }}
        />
      </div>

      {/* Tricolor accent */}
      <div className="relative mb-6 flex justify-center">
        <div className="flex h-1.5 w-40 overflow-hidden rounded-full shadow-sm">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white/90" />
          <div className="flex-1 bg-[#138808]" />
        </div>
      </div>

      {/* Flag with glow */}
      <div className="relative mb-5 inline-block">
        <div
          className="absolute -inset-3 rounded-full opacity-20 blur-xl"
          style={{ background: "white" }}
          aria-hidden="true"
        />
        <svg width="56" height="40" viewBox="0 0 80 56" aria-hidden="true" className="relative drop-shadow-lg">
          <rect x="0" y="0" width="80" height="18.67" fill="#FF9933" />
          <rect x="0" y="18.67" width="80" height="18.67" fill="#FFFFFF" />
          <rect x="0" y="37.33" width="80" height="18.67" fill="#138808" />
          <circle cx="40" cy="28" r="8" fill="none" stroke="#000080" strokeWidth="1.2" />
          <circle cx="40" cy="28" r="2.5" fill="#000080" />
        </svg>
      </div>

      <h1
        className="relative mb-2 text-3xl font-extrabold tracking-tight text-white"
        style={{ textShadow: "0 2px 8px oklch(0.13 0.02 30 / 0.3)", letterSpacing: "-0.02em" }}
      >
        {siteName}
      </h1>
      <p className="relative mx-auto max-w-xs text-sm leading-relaxed text-white/80">
        {tagline} — {heroSubtitle}
      </p>
    </section>
  );
}
