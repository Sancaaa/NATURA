import Link from "next/link";
import { getTeacherStudents } from "@/lib/db/classroom";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function DaftarSiswa() {
  const students = await getTeacherStudents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Siswa</h1>
        <p className="text-sm text-muted">
          Semua siswa dari seluruh kelasmu ({students.length}).
        </p>
      </div>

      {students.length === 0 ? (
        <Card className="border-dashed text-sm text-muted">
          Belum ada siswa. Bagikan kode gabung kelasmu di{" "}
          <Link href="/kelas" className="font-semibold text-primary">
            halaman Kelas
          </Link>
          .
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/5 text-left text-xs uppercase text-muted">
                <tr>
                  <th className="p-3">Nama</th>
                  <th className="p-3">Kelas</th>
                  <th className="p-3">Rata skor</th>
                  <th className="p-3">Tugas selesai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-black/[0.02]">
                    <td className="p-3">
                      <Link
                        href={`/siswa/${s.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {s.nama}
                      </Link>
                    </td>
                    <td className="p-3 text-muted">
                      {s.kelas.join(", ") || "—"}
                    </td>
                    <td className="p-3">
                      {s.skorRataRata == null ? (
                        <span className="text-muted">—</span>
                      ) : (
                        <Badge
                          tone={s.skorRataRata >= 70 ? "success" : "danger"}
                        >
                          {s.skorRataRata}
                        </Badge>
                      )}
                    </td>
                    <td className="p-3 text-muted">{s.jumlahSelesai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
