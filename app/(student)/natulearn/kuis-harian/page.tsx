import Link from "next/link";
import { getDailyQuiz, getStreak } from "@/lib/db/daily";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { buttonClass } from "@/components/ui/Button";
import { Flame, ListChecks } from "lucide-react";

export default async function KuisHarian() {
  const [quiz, streak] = await Promise.all([getDailyQuiz(), getStreak()]);

  const hariIni = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div>
      <PageHeader title="Kuis Harian" back="/natulearn" />
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-primary p-4 text-white">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15">
            <Flame className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <div className="text-xs text-white/80">{hariIni}</div>
            <div className="text-sm font-semibold">
              {streak > 0 ? `${streak} hari berturut-turut` : "Mulai streak-mu"}
            </div>
          </div>
        </div>

        {!quiz ? (
          <Card className="border-dashed text-sm text-muted">
            Belum ada kuis yang tersedia.
          </Card>
        ) : (
          <Card className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <ListChecks className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{quiz.judul}</div>
                <div className="text-xs text-muted">
                  {quiz.jumlahSoal} soal
                  {quiz.topik ? ` · ${quiz.topik}` : ""}
                </div>
              </div>
            </div>
            <Link
              href={`/natulearn/kuis/${quiz.id}?from=harian`}
              className={`${buttonClass("primary", "md")} w-full`}
            >
              Kerjakan sekarang
            </Link>
          </Card>
        )}

        <p className="text-center text-xs text-muted">
          Kuis berganti otomatis setiap hari.
        </p>
      </div>
    </div>
  );
}
