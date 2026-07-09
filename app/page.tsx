import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Leaf,
  GraduationCap,
  Users,
  ScanLine,
  LogIn,
  UserPlus,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentProfile, homeFor } from "@/lib/auth";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-8 p-6">
      <div className="text-center">
        <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-primary text-white">
          <Leaf className="h-9 w-9" />
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">NATURA</h1>
        <p className="mt-1 text-sm text-muted">
          Belajar Farmakognosi dengan AR — visual, interaktif, menyenangkan.
        </p>
      </div>
      {children}
    </main>
  );
}

function AuthLanding() {
  return (
    <Shell>
      <div className="grid gap-3">
        <Link
          href="/masuk"
          className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm transition hover:border-primary"
        >
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <LogIn className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <div className="font-bold">Masuk</div>
            <div className="text-xs text-muted">Sudah punya akun</div>
          </div>
        </Link>
        <Link
          href="/daftar"
          className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm transition hover:border-primary"
        >
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent">
            <UserPlus className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <div className="font-bold">Daftar</div>
            <div className="text-xs text-muted">Buat akun siswa atau guru</div>
          </div>
        </Link>
      </div>
    </Shell>
  );
}

function DemoLanding() {
  return (
    <Shell>
      <div className="grid gap-3">
        <Link
          href="/beranda"
          className="group rounded-2xl border border-line bg-surface p-5 shadow-sm transition hover:border-primary"
        >
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <GraduationCap className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <div className="font-bold">Masuk sebagai Siswa</div>
              <div className="text-xs text-muted">AR, library, kuis, tutor</div>
            </div>
            <ScanLine className="h-5 w-5 text-muted group-hover:text-primary" />
          </div>
        </Link>
        <Link
          href="/dashboard"
          className="group rounded-2xl border border-line bg-surface p-5 shadow-sm transition hover:border-primary"
        >
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent">
              <Users className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <div className="font-bold">Masuk sebagai Guru</div>
              <div className="text-xs text-muted">Dashboard & penugasan</div>
            </div>
          </div>
        </Link>
      </div>
      <p className="text-center text-xs text-muted">
        Mode demo · data contoh (Supabase belum dikonfigurasi)
      </p>
    </Shell>
  );
}

export default async function Home() {
  if (isSupabaseConfigured) {
    const profile = await getCurrentProfile();
    if (profile) redirect(homeFor(profile.role));
    return <AuthLanding />;
  }
  return <DemoLanding />;
}
