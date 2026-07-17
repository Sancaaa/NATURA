import Link from "next/link";
import { getTeacherAssignments, getTeacherClasses } from "@/lib/db/classroom";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { DeleteAssignmentButton } from "@/components/teacher/DeleteAssignmentButton";
import { formatDeadline } from "@/lib/format";
import { Paperclip, Plus } from "lucide-react";

/**
 * Manajemen tugas lintas kelas. Form pembuatan tetap ada di /kelas/[id]
 * karena tugas selalu terikat satu kelas — halaman ini untuk memantau &
 * mengelola semuanya di satu tempat.
 */
export default async function ManajemenTugas() {
  const [tugas, classes] = await Promise.all([
    getTeacherAssignments(),
    getTeacherClasses(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Tugas</h1>
        <p className="text-sm text-muted">
          Semua tugas dari seluruh kelasmu. Siswa melihatnya di NatuLearn →
          Tugas dari Guru.
        </p>
      </div>

      {classes.length === 0 ? (
        <Card className="border-dashed text-sm text-muted">
          Belum ada kelas.{" "}
          <Link href="/kelas" className="font-semibold text-primary">
            Buat kelas dulu
          </Link>{" "}
          sebelum menugaskan kuis.
        </Card>
      ) : (
        <Card className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">Tambah tugas untuk:</span>
          {classes.map((c) => (
            <Link
              key={c.id}
              href={`/kelas/${c.id}`}
              className={buttonClass("outline", "sm")}
            >
              <Plus className="h-3.5 w-3.5" /> {c.nama}
            </Link>
          ))}
        </Card>
      )}

      <section>
        <h2 className="mb-2 font-bold">Daftar tugas ({tugas.length})</h2>
        {tugas.length === 0 ? (
          <Card className="border-dashed text-sm text-muted">
            Belum ada tugas. Pilih kelas di atas untuk menugaskan kuis.
          </Card>
        ) : (
          <div className="space-y-2">
            {tugas.map((t) => {
              const lengkap =
                t.totalSiswa > 0 && t.jumlahSubmit >= t.totalSiswa;
              return (
                <Card key={t.id} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold">{t.judul}</div>
                      <div className="truncate text-xs text-muted">
                        {t.kelas}
                        {t.topik ? ` · ${t.topik}` : ""}
                      </div>
                    </div>
                    <DeleteAssignmentButton
                      assignmentId={t.id}
                      classId={t.classId}
                      judul={t.judul}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone={lengkap ? "success" : "primary"}>
                      {t.jumlahSubmit}/{t.totalSiswa} submit
                    </Badge>
                    <Badge tone="muted">Bobot {t.bobot}</Badge>
                    {t.deadline && (
                      <Badge tone="muted">
                        Tenggat {formatDeadline(t.deadline)}
                      </Badge>
                    )}
                    {t.lampiran.length > 0 && (
                      <Badge tone="muted">
                        <Paperclip className="mr-1 h-3 w-3" />
                        {t.lampiran.length}
                      </Badge>
                    )}
                    <Link
                      href={`/kelas/${t.classId}`}
                      className="ml-auto text-xs font-semibold text-primary hover:underline"
                    >
                      Buka kelas →
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
