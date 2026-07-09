"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FilePlus2,
  LogOut,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/cn";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/kelas", label: "Kelas", icon: Users },
  { href: "/buat-kuis", label: "Buat Kuis", icon: FilePlus2 },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-surface p-4 md:flex">
      <div className="mb-6 flex items-center gap-2 px-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white">
          <Leaf className="h-5 w-5" />
        </span>
        <span className="text-lg font-bold">NATURA</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((it) => {
          const active = path === it.href || path.startsWith(it.href + "/");
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-black/5",
              )}
            >
              <Icon className="h-5 w-5" />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <Link
        href="/keluar"
        className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-black/5"
      >
        <LogOut className="h-5 w-5" />
        Keluar
      </Link>
    </aside>
  );
}
