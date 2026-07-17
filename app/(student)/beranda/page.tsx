import Link from "next/link";
import { getPlants } from "@/lib/db/plants";
import { getStudentAssignments } from "@/lib/db/classroom";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDeadline } from "@/lib/format";
import {
  ScanLine,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle2,
  UserPlus,
} from "lucide-react";

export default async function Beranda() {
  const [tugas, plants] = await Promise.all([
    getStudentAssignments(),
    getPlants(),
  ]);

  return (
    <div>
      <header className="px-4 pt-6">
        <p className="text-sm text-muted">Halo,</p>
        <h1 className="text-2xl font-extrabold">Aisyah 👋</h1>
      </header>

      <div className="space-y-6 p-4">
        <Link
          href="/natulab/ar"
          className="block rounded-2xl bg-primary p-5 text-white shadow-sm"
        >
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/15">
              <ScanLine className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <div className="text-lg font-bold">Pindai Kartu AR</div>
              <div className="text-sm text-white/85">
                Arahkan kamera ke kartu NATURA
              </div>
            </div>
            <ChevronRight className="h-5 w-5" />
          </div>
        </Link>

        <section>
          <h2 className="mb-2 font-bold">Lanjutkan belajar</h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {plants.slice(0, 8).map((p) => (
              <Link
                key={p.id}
                href={`/natulab/tanaman/${p.id}`}
                className="w-36 shrink-0"
              >
                <Card className="p-3">
                  <div className="mb-2 grid h-20 place-items-center rounded-xl bg-primary/10 text-3xl">
                    🌿
                  </div>
                  <div className="text-sm font-semibold">{p.namaLokal}</div>
                  <div className="truncate text-xs italic text-muted">
                    {p.namaLatin}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-bold">Tugas dari guru</h2>
            <Link href="/gabung" className="text-xs font-semibold text-primary">
              + Gabung kelas
            </Link>
          </div>
          {tugas.length === 0 ? (
            <Link href="/gabung" className="block">
              <Card className="flex items-center gap-3 border-dashed">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
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
            <div className="space-y-2">
              {tugas.slice(0, 4).map((t) => (
                <Link
                  key={t.assignmentId}
                  href={`/natulearn/tugas/${t.assignmentId}`}
                  className="block"
                >
                  <Card className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/15 text-accent">
                      <Clock className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{t.judul}</div>
                      <div className="text-xs text-muted">{t.kelas}</div>
                    </div>
                    {t.sudahDikerjakan ? (
                      <Badge tone="success">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        {t.skor ?? "selesai"}
                      </Badge>
                    ) : t.deadline ? (
                      <Badge tone="accent">{formatDeadline(t.deadline)}</Badge>
                    ) : null}
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        <Link href="/natubot" className="block">
          <Card className="flex items-center gap-3 border-dashed">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <div className="text-sm font-semibold">Tanya NatuBot</div>
              <div className="text-xs text-muted">
                Bingung materi? Tanya di sini.
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
