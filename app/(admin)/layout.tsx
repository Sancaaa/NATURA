import { ShieldCheck } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { signOutAction } from "@/lib/actions/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["admin"]);
  return (
    <div className="min-h-dvh">
      <header className="flex items-center gap-2 border-b border-line bg-surface px-5 py-3">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-ink text-white">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <span className="font-bold">NATURA — Admin</span>
        <form action={signOutAction} className="ml-auto">
          <button type="submit" className="text-xs text-muted">
            Keluar
          </button>
        </form>
      </header>
      <AdminNav />
      <main className="mx-auto max-w-4xl p-6">{children}</main>
    </div>
  );
}
