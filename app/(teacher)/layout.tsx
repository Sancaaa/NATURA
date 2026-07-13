import Link from "next/link";
import { Leaf } from "lucide-react";
import Sidebar from "@/components/teacher/Sidebar";
import { requireRole } from "@/lib/auth";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["teacher", "admin"]);
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex-1">
        <header className="flex items-center gap-2 border-b border-line bg-surface px-4 py-3 md:hidden">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-white">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="font-bold">NATURA — Guru</span>
          <Link href="/keluar" className="ml-auto text-xs text-muted">
            Keluar
          </Link>
        </header>
        <main className="mx-auto max-w-5xl p-6">{children}</main>
      </div>
    </div>
  );
}
