import Link from "next/link";
import { getTeacherDashboard, getTeacherTopicScores } from "@/lib/db/classroom";
import { Card } from "@/components/ui/Card";
import { BarChart } from "@/components/charts/BarChart";
import {
  Users,
  TrendingUp,
  BookMarked,
  School,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <Card className="flex items-start justify-between gap-2">
      <div>
        <div className="text-xs font-medium text-muted">{label}</div>
        <div className="mt-1 text-3xl font-extrabold text-primary">{value}</div>
        {sub && (
          <div className="mt-1 text-xs font-medium text-success">{sub}</div>
        )}
      </div>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
    </Card>
  );
}

export default async function Dashboard() {
  const [d, chartData] = await Promise.all([
    getTeacherDashboard(),
    getTeacherTopicScores(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
          Dashboard Analitik Guru
        </h1>
        <p className="text-sm text-muted">
          Ikhtisar performa akademik & aktivitas lab siswamu.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Siswa" value={d.totalSiswa} />
        <StatCard
          icon={TrendingUp}
          label="Rata-rata Nilai"
          value={d.rataSkor}
        />
        <StatCard icon={School} label="Jumlah Kelas" value={d.jumlahKelas} />
        <StatCard
          icon={BookMarked}
          label="Jumlah Tugas"
          value={d.jumlahTugas}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card className="p-5">
          <h2 className="mb-1 text-lg font-bold">Rata-rata Skor per Topik</h2>
          <p className="mb-4 text-sm text-muted">
            Dihitung dari tugas yang telah dikumpulkan siswa.
          </p>
          {chartData.length === 0 ? (
            <div className="grid h-40 place-items-center rounded-2xl bg-black/[0.02] text-sm text-muted">
              Grafik muncul setelah siswa mengerjakan tugas.
            </div>
          ) : (
            <BarChart data={chartData} />
          )}
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">Performa Siswa</h2>
            <Link
              href="/siswa"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Lihat Semua
            </Link>
          </div>
          {d.perhatian.length === 0 ? (
            <p className="text-sm text-muted">
              Semua siswa dalam kondisi baik. 🎉
            </p>
          ) : (
            <div className="space-y-1.5">
              {d.perhatian.map((st) => (
                <Link
                  key={st.id}
                  href={`/siswa/${st.id}`}
                  className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-black/[0.03]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-danger/10 text-sm font-bold text-danger">
                    {st.nama.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold">{st.nama}</div>
                    <div className="text-xs font-medium text-danger">
                      Butuh Perhatian
                    </div>
                  </div>
                  <span className="rounded-lg bg-danger/10 px-2 py-1 text-xs font-bold text-danger">
                    {st.skor ?? "—"}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
