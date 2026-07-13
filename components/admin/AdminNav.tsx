"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Users, Leaf, FlaskConical, BookOpen } from "lucide-react";

const tabs = [
  { href: "/admin", label: "Pengguna", icon: Users },
  { href: "/admin/tanaman", label: "Tanaman", icon: Leaf },
  { href: "/admin/alat", label: "Alat", icon: FlaskConical },
  { href: "/admin/pustaka", label: "Pustaka", icon: BookOpen },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-4">
        {tabs.map((t) => {
          const active =
            t.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(t.href);
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-ink",
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
