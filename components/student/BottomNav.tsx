"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FlaskConical, BookOpen, Bot, User } from "lucide-react";
import { cn } from "@/lib/cn";

const items = [
  { href: "/beranda", label: "Home", icon: Home },
  { href: "/natulab", label: "NatuLab", icon: FlaskConical },
  { href: "/natulearn", label: "NatuLearn", icon: BookOpen },
  { href: "/natubot", label: "NatuBot", icon: Bot },
  { href: "/profil", label: "Profil", icon: User },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((it) => {
          const active = path === it.href || path.startsWith(it.href + "/");
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-semibold transition",
                active ? "text-primary" : "text-muted",
              )}
            >
              <span
                className={cn(
                  "grid h-8 w-12 place-items-center rounded-full transition",
                  active && "bg-primary/10",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.8} />
              </span>
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
