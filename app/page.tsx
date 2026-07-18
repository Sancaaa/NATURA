import Link from "next/link";
import { redirect } from "next/navigation";
import { Leaf, GraduationCap, Users, ShieldCheck } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentProfile, homeFor } from "@/lib/auth";

function DemoLanding() {
  const roles = [
    {
      href: "/beranda",
      label: "Masuk sebagai Murid",
      desc: "AR, library, kuis, tutor",
      icon: GraduationCap,
      tone: "bg-primary/10 text-primary",
    },
    {
      href: "/dashboard",
      label: "Masuk sebagai Guru",
      desc: "Kelas, penugasan, nilai",
      icon: Users,
      tone: "bg-accent/15 text-accent",
    },
    {
      href: "/admin",
      label: "Masuk sebagai Admin",
      desc: "Kelola pengguna & peran",
      icon: ShieldCheck,
      tone: "bg-ink/10 text-ink",
    },
  ];
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

      <div className="grid gap-3">
        {roles.map((r) => {
          const Icon = r.icon;
          return (
            <Link
              key={r.href}
              href={r.href}
              className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm transition hover:border-primary"
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-xl ${r.tone}`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <div className="font-bold">{r.label}</div>
                <div className="text-xs text-muted">{r.desc}</div>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted">
        Mode pratinjau — data contoh
      </p>
    </main>
  );
}

export default async function Home() {
  if (isSupabaseConfigured) {
    const profile = await getCurrentProfile();
    if (profile) redirect(homeFor(profile.role));
    redirect("/masuk");
  }
  return <DemoLanding />;
}
