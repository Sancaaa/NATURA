import Link from "next/link";
import { getTeacherDashboard, getTeacherTopicScores } from "@/lib/db/classroom";
import { Card } from "@/components/ui/Card";
import { BarChart } from "@/components/charts/BarChart";
import {
  Users,
  TrendingUp,
  BookMarked,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Card className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-xs text-muted">{label}</div>
      </div>
    </Card>
  );
}

export default async function Dashboard() {
  // Skor per topik dihitung dari submissions asli (dulu angka hardcoded).
  const [d, chartData] = await Promise.all([
    getTeacherDashboard(),
    getTeacherTopicScores(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Dashboard</h1>
        <p className="text-sm text-muted">
          Ringkasan aktivitas & progres siswa
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat
          icon={<Users className="h-5 w-5" />}
          label="Total siswa"
          value={d.totalSiswa}
        />
        <Stat
          icon={<TrendingUp className="h-5 w-5" />}
          label="Rata-rata skor"
          value={d.rataSkor}
        />
        <Stat
          icon={<BookMarked className="h-5 w-5" />}
          label="Jumlah tugas"
          value={d.jumlahTugas}
        />
        <Stat
          icon={<AlertTriangle className="h-5 w-5" />}
          label="Perlu perhatian"
          value={d.perhatian.length}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-bold">Rata-rata skor per topik</h2>
          {chartData.length === 0 ? (
            <p className="text-sm text-muted">
              Belum ada tugas yang dikumpulkan — grafik muncul setelah siswa
              mengerjakan tugas.
            </p>
          ) : (
            <BarChart data={chartData} />
          )}
        </Card>
        <Card>
          <h2 className="mb-3 font-bold">Siswa perlu perhatian</h2>
          {d.perhatian.length === 0 ? (
            <p className="text-sm text-muted">
              Tidak ada — semua siswa dalam kondisi baik.
            </p>
          ) : (
            <div className="space-y-2">
              {d.perhatian.map((st) => (
                <Link
                  key={st.id}
                  href={`/siswa/${st.id}`}
                  className="flex items-center gap-3 rounded-xl border border-line p-3 hover:bg-black/5"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-danger/10 text-sm font-bold text-danger">
                    {st.nama.charAt(0)}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{st.nama}</div>
                    <div className="text-xs text-muted">
                      skor {st.skor ?? "belum ada"}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted" />
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
