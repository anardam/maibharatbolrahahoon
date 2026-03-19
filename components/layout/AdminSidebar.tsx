"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/articles", label: "Articles", icon: "📝" },
  { href: "/categories", label: "Categories", icon: "📁", superAdmin: true },
  { href: "/review", label: "Review Queue", icon: "✅", superAdmin: true },
  { href: "/media", label: "Media", icon: "🖼️" },
  { href: "/users", label: "Users", icon: "👥", superAdmin: true },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-default bg-card flex h-screen w-64 flex-col border-r">
      {/* Logo */}
      <div className="border-default border-b p-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🇮🇳</span>
          <span className="text-sm font-bold">MBBRH Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted hover:bg-accent hover:text-foreground"
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.superAdmin && (
                    <span className="ml-auto rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                      SA
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="border-default border-t p-4">
        <div className="flex items-center gap-3">
          <UserButton />
          <Link
            href="/"
            className="text-muted text-xs hover:underline"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </aside>
  );
}
