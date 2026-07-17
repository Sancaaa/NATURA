import Link from "next/link";
import { getStudentAssignments } from "@/lib/db/classroom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatusTugasBadge } from "@/components/student/StatusTugasBadge";
import { formatDeadline } from "@/lib/format";
import { UserPlus, ChevronRight, Paperclip } from "lucide-react";

export default async function DaftarTugas() {
  const tugas = await getStudentAssignments();

  return (
    <div>
      <PageHeader title="Tugas dari Guru" back="/natulearn" />
      <div className="space-y-3 p-4">
        {tugas.length === 0 ? (
          <Link href="/gabung" className="block">
            <Card className="flex items-center gap-3 border-dashed">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <UserPlus className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">Gabung kelas</span>
                <span className="block text-xs text-muted">
                  Masukkan kode dari guru untuk menerima tugas.
                </span>
              </span>
              <ChevronRight className="h-5 w-5 text-muted" />
            </Card>
          </Link>
        ) : (
          tugas.map((t) => (
            <Link
              key={t.assignmentId}
              href={`/natulearn/tugas/${t.assignmentId}`}
              className="block"
            >
              <Card className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{t.judul}</div>
                    <div className="truncate text-xs text-muted">
                      {t.kelas}
                      {t.topik ? ` · ${t.topik}` : ""}
                    </div>
                  </div>
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <StatusTugasBadge status={t.status} />
                  <Badge tone="muted">Bobot {t.bobot}</Badge>
                  {t.deadline && (
                    <Badge tone="muted">Tenggat {formatDeadline(t.deadline)}</Badge>
                  )}
                  {t.lampiran.length > 0 && (
                    <Badge tone="muted">
                      <Paperclip className="mr-1 h-3 w-3" />
                      {t.lampiran.length}
                    </Badge>
                  )}
                  {t.sudahDikerjakan && t.skor != null && (
                    <Badge tone="success">Skor {t.skor}</Badge>
                  )}
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
