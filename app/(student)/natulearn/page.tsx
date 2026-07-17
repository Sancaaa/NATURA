import { getStudentAssignments } from "@/lib/db/classroom";
import { getLibrary } from "@/lib/db/library";
import { getDailyQuiz } from "@/lib/db/daily";
import { AppHeader } from "@/components/student/AppHeader";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { ModulCard, TugasCard } from "@/components/student/LearnCards";
import { FileQuestion } from "lucide-react";

export default async function NatuLearn() {
  const [quiz, materi, tugas] = await Promise.all([
    getDailyQuiz(),
    getLibrary(),
    getStudentAssignments(),
  ]);

  return (
    <div>
      <AppHeader title="NatuLearn" />

      <div className="space-y-8 p-4">
        <HeroBanner
          icon={FileQuestion}
          eyebrow="Kuis Harian"
          title={quiz ? quiz.judul : "Belum ada kuis"}
          description={
            quiz
              ? `${quiz.jumlahSoal} Soal Pilihan Ganda`
              : "Kuis harian akan muncul di sini."
          }
          ctaLabel={quiz ? "Mulai Kuis" : undefined}
          ctaHref={quiz ? `/natulearn/kuis/${quiz.id}?from=harian` : undefined}
        />

        <section>
          <SectionHeader title="Materi" href="/natulearn/modul" />
          {materi.length === 0 ? (
            <Card className="border-dashed text-sm text-muted">
              Belum ada materi.
            </Card>
          ) : (
            <div className="space-y-3">
              {materi.slice(0, 2).map((m) => (
                <ModulCard key={m.id} item={m} />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader title="Tugas" href="/natulearn/tugas" />
          {tugas.length === 0 ? (
            <Card className="border-dashed text-sm text-muted">
              Belum ada tugas. Gabung kelas untuk menerima tugas dari guru.
            </Card>
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
