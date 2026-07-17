import Sidebar from "@/components/teacher/Sidebar";
import { Logo } from "@/components/ui/Logo";
import { requireRole } from "@/lib/auth";
import { signOutAction } from "@/lib/actions/auth";

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
          <Logo size={28} />
          <span className="font-extrabold">NatuTeach</span>
          <form action={signOutAction} className="ml-auto">
            <button type="submit" className="text-xs text-muted">
              Keluar
            </button>
          </form>
        </header>
        <main className="mx-auto max-w-5xl p-6">{children}</main>
      </div>
    </div>
  );
}
