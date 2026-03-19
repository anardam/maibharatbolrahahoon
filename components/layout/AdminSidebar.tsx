"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Nav data
// ---------------------------------------------------------------------------

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface NavGroup {
  label: string;
  adminOnly?: boolean;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Navigation",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: <IconDashboard />,
      },
      {
        href: "/articles",
        label: "Articles",
        icon: <IconArticles />,
      },
    ],
  },
  {
    label: "Administration",
    adminOnly: true,
    items: [
      {
        href: "/categories",
        label: "Categories",
        icon: <IconCategories />,
      },
      {
        href: "/review",
        label: "Review Queue",
        icon: <IconReview />,
      },
      {
        href: "/users",
        label: "Users",
        icon: <IconUsers />,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface AdminSidebarProps {
  onClose?: () => void;
  /**
   * Number of articles currently pending review. When > 0 a badge is shown
   * on the Review Queue nav item. Pass undefined to hide the badge entirely.
   */
  reviewCount?: number;
}

export function AdminSidebar({ onClose, reviewCount }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="flex h-screen w-64 flex-col border-r"
      style={{
        borderColor: "var(--border)",
        background:
          "linear-gradient(180deg, oklch(1 0 0) 0%, oklch(0.985 0.004 60) 100%)",
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Logo area                                                           */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="flex items-center justify-between border-b px-4 py-3.5"
        style={{ borderColor: "var(--border)" }}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        >
          <IndiaFlag size={26} />
          <div className="flex flex-col leading-none">
            <span
              className="text-sm font-extrabold tracking-tight text-[var(--foreground)]"
              style={{ letterSpacing: "-0.03em" }}
            >
              MBBRH
            </span>
            <span className="mt-0.5 text-[9px] font-medium uppercase tracking-widest text-[var(--muted-foreground)]">
              Admin Panel
            </span>
          </div>
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-lg p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)] lg:hidden"
          >
            <IconClose />
          </button>
        )}
      </div>

      {/* Tricolor bar */}
      <div className="flex h-[2px] w-full flex-shrink-0" aria-hidden="true">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Navigation                                                          */}
      {/* ------------------------------------------------------------------ */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
        <div className="space-y-5">
          {NAV_GROUPS.map((group) => (
            <section key={group.label}>
              {/* Group label */}
              <div className="mb-1.5 flex items-center gap-1.5 px-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                  {group.label}
                </p>
                {group.adminOnly && (
                  <span
                    className="text-[var(--muted-foreground)]"
                    aria-label="Admin only section"
                    title="Super admin access required"
                  >
                    <IconLock />
                  </span>
                )}
              </div>

              {/* Items */}
              <ul className="space-y-0.5" role="list">
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  const showBadge =
                    item.href === "/review" &&
                    typeof reviewCount === "number" &&
                    reviewCount > 0;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        onClick={onClose}
                        className={cn(
                          // Base layout
                          "group relative flex items-center gap-3 rounded-xl py-2.5 pr-3 pl-3 text-sm",
                          // Transition
                          "transition-all duration-150 ease-out",
                          // Focus ring
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1",
                          isActive
                            ? "font-semibold text-[var(--primary)]"
                            : "font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                        )}
                        style={
                          isActive
                            ? {
                                background: "oklch(0.52 0.22 25 / 0.09)",
                              }
                            : {}
                        }
                      >
                        {/* Left accent bar — active only */}
                        {isActive && (
                          <span
                            className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-[var(--primary)]"
                            aria-hidden="true"
                          />
                        )}

                        {/* Icon */}
                        <span
                          className={cn(
                            "flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center transition-transform duration-150",
                            isActive
                              ? "text-[var(--primary)]"
                              : "text-[var(--muted-foreground)] group-hover:translate-x-px group-hover:text-[var(--foreground)]"
                          )}
                          aria-hidden="true"
                        >
                          {item.icon}
                        </span>

                        {/* Label */}
                        <span className="flex-1 leading-none">{item.label}</span>

                        {/* Review count badge */}
                        {showBadge && (
                          <span
                            className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums"
                            style={{
                              background: "var(--primary)",
                              color: "var(--primary-foreground)",
                            }}
                            aria-label={`${reviewCount} pending reviews`}
                          >
                            {(reviewCount ?? 0) > 99 ? "99+" : reviewCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </nav>

      {/* ------------------------------------------------------------------ */}
      {/* Footer — user + back-to-site                                        */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="flex-shrink-0 border-t p-4"
        style={{ borderColor: "var(--border)" }}
      >
        {/* Subtle divider rule above footer */}
        <div className="flex items-center gap-3">
          <UserButton />
          <Link
            href="/"
            className="group flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]"
          >
            <span
              className="transition-transform duration-150 group-hover:-translate-x-0.5"
              aria-hidden="true"
            >
              <IconChevronLeft />
            </span>
            Back to site
          </Link>
        </div>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Inline SVG icons — 18×18 viewport, stroke-2, round caps/joins
// ---------------------------------------------------------------------------

function IconDashboard() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Top-left square */}
      <rect x="2" y="2" width="6" height="6" rx="1.5" />
      {/* Top-right square */}
      <rect x="10" y="2" width="6" height="6" rx="1.5" />
      {/* Bottom-left square */}
      <rect x="2" y="10" width="6" height="6" rx="1.5" />
      {/* Bottom-right — taller rectangle to create asymmetry / data feel */}
      <rect x="10" y="10" width="6" height="6" rx="1.5" />
    </svg>
  );
}

function IconArticles() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Document outline */}
      <path d="M10.5 2H4.5A1.5 1.5 0 0 0 3 3.5v11A1.5 1.5 0 0 0 4.5 16h9a1.5 1.5 0 0 0 1.5-1.5V7l-4.5-5Z" />
      {/* Fold */}
      <path d="M10.5 2v5H15" />
      {/* Text lines */}
      <line x1="6" y1="10" x2="12" y2="10" />
      <line x1="6" y1="13" x2="10" y2="13" />
    </svg>
  );
}

function IconCategories() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Folder shape */}
      <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4H7l1.5 2H14.5A1.5 1.5 0 0 1 16 7.5V13a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 2 13V5.5Z" />
    </svg>
  );
}

function IconReview() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Clipboard base */}
      <rect x="3" y="3.5" width="12" height="13" rx="1.5" />
      {/* Clip notch */}
      <path d="M6.5 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5v-1Z" />
      {/* Check mark */}
      <path d="M6.5 10l1.75 1.75 3.25-3.5" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Primary person head */}
      <circle cx="7" cy="6" r="2.5" />
      {/* Primary person body */}
      <path d="M2 15.5c0-2.485 2.239-4.5 5-4.5s5 2.015 5 4.5" />
      {/* Secondary person head */}
      <circle cx="13" cy="6.5" r="2" />
      {/* Secondary person body arc */}
      <path d="M11.5 11.25C12.3 11 13.1 11 14 11c2.21 0 4 1.79 4 4" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 12 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="1.5" y="6" width="9" height="7" rx="1.5" />
      <path d="M4 6V4a2 2 0 0 1 4 0v2" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 2L4 6l4 4" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// India flag mark
// ---------------------------------------------------------------------------

function IndiaFlag({ size = 26 }: { size?: number }) {
  const h = Math.round(size * 0.7);
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 80 56"
      aria-label="Indian flag"
      role="img"
    >
      <rect x="0" y="0" width="80" height="18.67" fill="#FF9933" />
      <rect x="0" y="18.67" width="80" height="18.67" fill="#FFFFFF" />
      <rect x="0" y="37.33" width="80" height="18.67" fill="#138808" />
      {/* Ashoka Chakra — 24 spokes */}
      <circle cx="40" cy="28" r="7" fill="none" stroke="#000080" strokeWidth="1.2" />
      <circle cx="40" cy="28" r="1.8" fill="#000080" />
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24;
        const rad = (angle * Math.PI) / 180;
        const x1 = 40 + 1.8 * Math.cos(rad);
        const y1 = 28 + 1.8 * Math.sin(rad);
        const x2 = 40 + 7 * Math.cos(rad);
        const y2 = 28 + 7 * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#000080"
            strokeWidth="0.6"
          />
        );
      })}
    </svg>
  );
}
