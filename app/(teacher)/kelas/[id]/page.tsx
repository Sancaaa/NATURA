import Link from "next/link";
import { notFound } from "next/navigation";
import { getClassDetail } from "@/lib/db/classroom";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AssignmentForm } from "@/components/teacher/AssignmentForm";
import { formatDeadline } from "@/lib/format";

export default async function KelasDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kelas = await getClassDetail(id);
  if (!kelas) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">{kelas.nama}</h1>
        <p className="text-sm text-muted">
          {kelas.tahunAjaran ?? "—"} · Kode gabung <b>{kelas.joinCode}</b>
        </p>
      </div>

      <Card>
        <h2 className="mb-3 font-bold">Tugaskan kuis</h2>
        <AssignmentForm classId={kelas.id} />
      </Card>

      <section>
        <h2 className="mb-2 font-bold">Tugas ({kelas.assignments.length})</h2>
        {kelas.assignments.length === 0 ? (
          <p className="text-sm text-muted">Belum ada tugas.</p>
        ) : (
          <div className="space-y-2">
            {kelas.assignments.map((a) => (
              <Card key={a.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-sm font-semibold">{a.judul}</div>
                  <div className="text-xs text-muted">
                    {a.topik}
                    {a.deadline ? ` · deadline ${formatDeadline(a.deadline)}` : ""}
                  </div>
                </div>
                <Badge tone="primary">
                  {a.jumlahSubmit}/{a.totalSiswa} submit
                </Badge>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-2 font-bold">Siswa ({kelas.students.length})</h2>
        {kelas.students.length === 0 ? (
          <p className="text-sm text-muted">
            Belum ada siswa. Bagikan kode <b>{kelas.joinCode}</b> agar siswa
            bergabung.
          </p>
        ) : (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black/5 text-left text-xs uppercase text-muted">
                  <tr>
                    <th className="p-3">Nama</th>
                    <th className="p-3">Rata skor</th>
                    <th className="p-3">Tugas selesai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {kelas.students.map((s) => (
                    <tr key={s.id} className="hover:bg-black/[0.02]">
                      <td className="p-3">
                        <Link
                          href={`/siswa/${s.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {s.nama}
                        </Link>
                      </td>
                      <td className="p-3 font-semibold">
                        {s.skorRataRata ?? "—"}
                      </td>
                      <td className="p-3 text-muted">{s.jumlahSelesai}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}
