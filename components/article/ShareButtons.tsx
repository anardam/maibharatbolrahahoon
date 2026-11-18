interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { name: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}` },
    { name: "X", href: `https://x.com/intent/post?text=${t}&url=${u}` },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Share</span>
      {links.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${l.name}`}
          className="rounded-full border px-4 py-1.5 text-xs font-semibold transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          style={{ borderColor: "oklch(0.91 0.015 60)" }}
        >
          {l.name}
        </a>
      ))}
    </div>
  );
}
