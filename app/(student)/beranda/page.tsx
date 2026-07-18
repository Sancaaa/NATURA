import Link from "next/link";
import { getPlants } from "@/lib/db/plants";
import { getStudentAssignments } from "@/lib/db/classroom";
import { getCurrentProfile } from "@/lib/auth";
import { Logo } from "@/components/ui/Logo";
import { Card } from "@/components/ui/Card";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TugasCard } from "@/components/student/LearnCards";
import { ScanLine, FlaskConical, BookOpen, Bot, UserPlus, ChevronRight } from "lucide-react";

const shortcuts = [
  { href: "/natulab", label: "NatuLab", icon: FlaskConical, tone: "bg-primary/10 text-primary" },
  { href: "/natulearn", label: "NatuLearn", icon: BookOpen, tone: "bg-accent/15 text-accent" },
  { href: "/natubot", label: "NatuBot", icon: Bot, tone: "bg-primary/10 text-primary" },
];

export default async function Beranda() {
  const [tugas, plants, profile] = await Promise.all([
    getStudentAssignments(),
    getPlants(),
    getCurrentProfile(),
  ]);
  const nama = (profile?.nama || "Siswa").split(" ")[0];

  return (
    <div>
      <header className="flex items-center justify-between px-4 pt-5">
        <div>
          <p className="text-sm text-muted">Halo,</p>
          <h1 className="text-2xl font-extrabold">{nama} 👋</h1>
        </div>
        <Logo size={40} />
      </header>

      <div className="space-y-8 p-4">
        <HeroBanner
          icon={ScanLine}
          title="Pindai Kartu AR"
          description="Arahkan kamera ke kartu NATURA untuk memunculkan visualisasi 3D."
          ctaLabel="Mulai Pindai"
          ctaHref="/ar/viewer.html"
          external
        />

        <section>
          <div className="grid grid-cols-3 gap-3">
            {shortcuts.map((s) => {
              const Icon = s.icon;
              return (
                <Link key={s.href} href={s.href} className="group">
                  <Card className="flex flex-col items-center gap-2 py-4 transition group-hover:shadow-card-hover">
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-2xl ${s.tone}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-semibold">{s.label}</span>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {plants.length > 0 && (
          <section>
            <SectionHeader title="Lanjutkan belajar" href="/natulab/tanaman" />
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
              {plants.slice(0, 8).map((p) => (
                <Link
                  key={p.id}
                  href={`/natulab/tanaman/${p.id}`}
                  className="w-36 shrink-0"
                >
                  <div className="overflow-hidden rounded-3xl border border-line/70 bg-surface shadow-card">
                    {p.gambarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.gambarUrl}
                        alt={p.namaLokal}
                        className="h-24 w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-24 place-items-center bg-gradient-to-br from-primary/15 to-accent/10 text-4xl">
                        🌿
                      </div>
                    )}
                    <div className="p-3">
                      <div className="truncate text-sm font-bold">
                        {p.namaLokal}
                      </div>
                      <div className="truncate text-xs italic text-muted">
                        {p.namaLatin}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <SectionHeader title="Tugas dari guru" href="/natulearn/tugas" />
          {tugas.length === 0 ? (
            <Link href="/gabung" className="block">
              <Card className="flex items-center gap-3 border-dashed">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <UserPlus className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold">Gabung kelas</div>
                  <div className="text-xs text-muted">
                    Masukkan kode dari guru untuk menerima tugas.
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted" />
              </Card>
            </Link>
          ) : (
            <div className="space-y-3">
              {tugas.slice(0, 3).map((t) => (
                <TugasCard key={t.assignmentId} tugas={t} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
