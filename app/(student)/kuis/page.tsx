import Link from "next/link";
import { getStudentAssignments } from "@/lib/db/classroom";
import { quizzes } from "@/lib/data/quizzes";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDeadline } from "@/lib/format";
import { ListChecks, ChevronRight, CheckCircle2 } from "lucide-react";

export default async function KuisList() {
  const tugas = await getStudentAssignments();
  const latihan = quizzes.filter((q) => q.sumber === "Latihan Mandiri");

  return (
    <div>
      <PageHeader title="Kuis & Latihan" />
      <div className="space-y-6 p-4">
        <section>
          <h2 className="mb-2 font-bold">Tugas dari Guru</h2>
          {tugas.length === 0 ? (
            <Card className="text-sm text-muted">
              Belum ada tugas.{" "}
              <Link href="/gabung" className="font-semibold text-primary">
                Gabung kelas
              </Link>{" "}
              untuk menerima tugas dari guru.
            </Card>
          ) : (
            <div className="space-y-2">
              {tugas.map((t) => (
                <Link
                  key={t.assignmentId}
                  href={`/kuis/${t.quizId}?assignment=${t.assignmentId}`}
                  className="block"
                >
                  <Card className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                      <ListChecks className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{t.judul}</div>
                      <div className="text-xs text-muted">
                        {t.kelas}
                        {t.topik ? ` · ${t.topik}` : ""}
                      </div>
                    </div>
                    {t.sudahDikerjakan ? (
                      <Badge tone="success">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        {t.skor ?? "selesai"}
                      </Badge>
                    ) : t.deadline ? (
                      <Badge tone="accent">{formatDeadline(t.deadline)}</Badge>
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted" />
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-2 font-bold">Latihan Mandiri</h2>
          <div className="space-y-2">
            {latihan.map((q) => (
              <Link key={q.id} href={`/kuis/${q.id}`} className="block">
                <Card className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <ListChecks className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{q.judul}</div>
                    <div className="text-xs text-muted">
                      {q.questions.length} soal · {q.topik}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted" />
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
