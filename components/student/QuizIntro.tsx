import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { buttonClass } from "@/components/ui/Button";
import { Clock, BarChart3, Info, ArrowRight } from "lucide-react";
import type { QuizForTaking } from "@/lib/db/quizzes";

const instruksi = [
  "Pilih satu jawaban yang paling tepat dari pilihan yang tersedia untuk setiap pertanyaan.",
  "Perhatikan waktu yang berjalan. Setiap soal memiliki batas waktu pengerjaan tertentu.",
  "Selesaikan seluruh kuis hingga akhir untuk mendapatkan poin pengalaman (XP) dan lencana.",
];

/** Layar pembuka kuis (Detail Kuis) - ditampilkan sebelum soal dimulai. */
export function QuizIntro({
  quiz,
  startHref,
  back,
}: {
  quiz: QuizForTaking;
  startHref: string;
  back: string;
}) {
  const n = quiz.questions.length;
  const menit = Math.max(1, Math.round(n * 1.5));
  const kesulitan = n <= 3 ? "Mudah" : n <= 7 ? "Sedang" : "Sulit";

  return (
    <div className="flex min-h-dvh flex-col">
      <PageHeader title="Detail Kuis" back={back} />

      <div className="flex-1 space-y-5 p-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a49ff] to-primary-dark p-6 text-white shadow-card">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
          <h1 className="text-2xl font-extrabold leading-tight">{quiz.judul}</h1>
          <p className="mt-1.5 text-sm text-white/80">
            {n} Soal Pilihan Ganda
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-line bg-surface p-4 text-center shadow-card">
            <Clock className="mx-auto h-5 w-5 text-primary" />
            <div className="mt-1.5 text-xs text-muted">Durasi</div>
            <div className="text-lg font-bold">{menit} Menit</div>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-4 text-center shadow-card">
            <BarChart3 className="mx-auto h-5 w-5 text-primary" />
            <div className="mt-1.5 text-xs text-muted">Kesulitan</div>
            <div className="text-lg font-bold">{kesulitan}</div>
          </div>
        </div>

        <div>
          <h2 className="mb-3 flex items-center gap-2 font-bold">
            <Info className="h-5 w-5 text-primary" /> Instruksi Kuis
          </h2>
          <div className="space-y-3 rounded-3xl border border-line bg-surface p-4 shadow-card">
            {instruksi.map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-muted">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-16 z-40 bg-bg/90 p-4 backdrop-blur">
        <Link href={startHref} className={`${buttonClass("primary", "lg")} w-full`}>
          Mulai Kuis <ArrowRight className="inline-block ml-1 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
