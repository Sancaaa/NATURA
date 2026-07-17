import { AppHeader } from "@/components/student/AppHeader";
import { Card } from "@/components/ui/Card";
import { ProgressRing } from "@/components/charts/ProgressRing";
import { Award, Flame, Download, LogOut, ChevronRight } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { signOutAction } from "@/lib/actions/auth";

export default async function Profil() {
  const profile = await getCurrentProfile();
  const nama = profile?.nama || "Aisyah Rahma";
  const inisial = nama.charAt(0).toUpperCase();

  const stats = [
    { icon: Award, value: "6", label: "Badge", tone: "text-accent" },
    { icon: Flame, value: "4", label: "Hari streak", tone: "text-accent" },
    { emoji: "🌿", value: "5", label: "Tanaman" },
  ];

  return (
    <div>
      <AppHeader title="Profil" />
      <div className="space-y-6 p-4">
        {/* Kartu profil gradien */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a49ff] to-primary-dark p-5 text-white shadow-card">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white/20 text-2xl font-bold backdrop-blur">
              {inisial}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-lg font-bold">{nama}</div>
              <div className="text-sm text-white/80">XI Farmasi A · NATURA</div>
            </div>
            <ProgressRing value={82} label="progres" size={68} />
          </div>
        </div>

        <section>
          <h2 className="mb-3 font-bold">Pencapaian</h2>
          <div className="grid grid-cols-3 gap-3">
            {stats.map((s, i) => (
              <Card key={i} className="text-center">
                {s.icon ? (
                  <s.icon className={`mx-auto h-6 w-6 ${s.tone}`} />
                ) : (
                  <div className="text-2xl">{s.emoji}</div>
                )}
                <div className="mt-1.5 text-lg font-bold">{s.value}</div>
                <div className="text-xs text-muted">{s.label}</div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-bold">Tersimpan Offline</h2>
          <Card className="divide-y divide-line p-0">
            {["Pengantar Simplisia", "Tahapan Pembuatan Simplisia"].map((t) => (
              <div key={t} className="flex items-center gap-3 p-3.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-success/10 text-success">
                  <Download className="h-4 w-4" />
                </span>
                <span className="flex-1 text-sm font-medium">{t}</span>
                <ChevronRight className="h-4 w-4 text-muted" />
              </div>
            ))}
          </Card>
        </section>

        <form action={signOutAction}>
          <button type="submit" className="block w-full text-left">
            <Card className="flex items-center gap-3 transition hover:shadow-card-hover">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-danger/10 text-danger">
                <LogOut className="h-4 w-4" />
              </span>
              <span className="flex-1 text-sm font-semibold text-danger">
                Keluar
              </span>
              <ChevronRight className="h-4 w-4 text-muted" />
            </Card>
          </button>
        </form>
      </div>
    </div>
  );
}
