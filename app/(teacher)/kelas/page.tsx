import Link from "next/link";
import { getTeacherClasses } from "@/lib/db/classroom";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CreateClassForm } from "@/components/teacher/CreateClassForm";
import { ChevronRight } from "lucide-react";

export default async function KelasList() {
  const classes = await getTeacherClasses();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Kelas</h1>

      <Card>
        <h2 className="mb-3 font-bold">Buat kelas baru</h2>
        <CreateClassForm />
      </Card>

      {classes.length === 0 ? (
        <p className="text-sm text-muted">
          Belum ada kelas. Buat kelas pertama di atas.
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {classes.map((c) => (
            <Link key={c.id} href={`/kelas/${c.id}`}>
              <Card className="flex items-center gap-3 transition hover:border-primary">
                <div className="flex-1">
                  <div className="font-bold">{c.nama}</div>
                  <div className="text-xs text-muted">
                    {c.tahunAjaran ?? "—"} · {c.jumlahSiswa} siswa
                  </div>
                </div>
                <Badge tone="muted">Kode {c.joinCode}</Badge>
                <ChevronRight className="h-4 w-4 text-muted" />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
