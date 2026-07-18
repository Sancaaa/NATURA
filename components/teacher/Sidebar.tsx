"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/lib/actions/auth";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  FileStack,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/kelas", label: "Kelas", icon: Users },
  { href: "/siswa", label: "Siswa", icon: GraduationCap },
  { href: "/modul", label: "Modul Materi", icon: BookOpen },
  { href: "/tugas", label: "Tugas", icon: ClipboardList },
  { href: "/bank-soal", label: "Bank Soal", icon: FileStack },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface p-4 md:flex">
      <div className="mb-6 flex items-center gap-2.5 px-2 pt-1">
        <Logo size={36} />
        <div className="leading-tight">
          <div className="font-extrabold">NatuTeach</div>
          <div className="text-[11px] font-medium text-muted">
            LMS Administrator
          </div>
        </div>
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
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                active
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted hover:bg-black/5 hover:text-ink",
              )}
            >
              <Icon className="h-5 w-5" />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <form action={signOutAction} className="mt-2">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-danger/10 hover:text-danger"
        >
          <LogOut className="h-5 w-5" />
          Keluar
        </button>
      </form>
    </aside>
  );
}
