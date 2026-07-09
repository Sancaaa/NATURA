"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ScanLine, BookOpen, ListChecks, User } from "lucide-react";
import { cn } from "@/lib/cn";

const items = [
  { href: "/beranda", label: "Beranda", icon: Home },
  { href: "/pindai", label: "Pindai", icon: ScanLine },
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/kuis", label: "Kuis", icon: ListChecks },
  { href: "/profil", label: "Profil", icon: User },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {items.map((it) => {
          const active = path === it.href || path.startsWith(it.href + "/");
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium",
                active ? "text-primary" : "text-muted",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
