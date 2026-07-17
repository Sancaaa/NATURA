"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { saveQuizResult } from "@/lib/actions/classroom";
import type { QuizForTaking } from "@/lib/db/quizzes";

export function QuizRunner({
  quiz,
  assignmentId,
  back = "/natulearn",
}: {
  quiz: QuizForTaking;
  assignmentId?: string;
  back?: string;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    const correct = quiz.questions.filter(
      (q) => answers[q.id] === q.kunci,
    ).length;
    return quiz.questions.length
      ? Math.round((correct / quiz.questions.length) * 100)
      : 0;
  }, [quiz, answers]);

  const allAnswered = quiz.questions.every((q) => answers[q.id] !== undefined);

  async function handleSubmit() {
    setSubmitted(true);
    await saveQuizResult({
      quizId: quiz.id,
      assignmentId,
      score,
      detail: answers,
    });
  }

  return (
    <div>
      <PageHeader title={quiz.judul} back={back} />
      <div className="space-y-5 p-4">
        {submitted && (
          <div className="rounded-2xl bg-primary p-5 text-center text-white">
            <div className="text-sm">Skor kamu</div>
            <div className="text-4xl font-extrabold">{score}</div>
            {assignmentId && (
              <div className="mt-1 text-xs text-white/80">
                Tersimpan sebagai tugas
              </div>
            )}
          </div>
        )}

        {quiz.questions.map((q, qi) => (
          <div
            key={q.id}
            className="rounded-2xl border border-line bg-surface p-4"
          >
            <div className="mb-3 font-semibold">
              {qi + 1}. {q.pertanyaan}
            </div>
            <div className="space-y-2">
              {q.opsi.map((opt, oi) => {
                const chosen = answers[q.id] === oi;
                const isCorrect = q.kunci === oi;
                let tone = "border-line";
                if (submitted) {
                  if (isCorrect) tone = "border-success bg-success/10";
                  else if (chosen) tone = "border-danger bg-danger/10";
                } else if (chosen) {
                  tone = "border-primary bg-primary/10";
                }
                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() =>
                      setAnswers((a) => ({ ...a, [q.id]: oi }))
                    }
                    className={cn(
                      "flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm",
                      tone,
                    )}
                  >
                    <span className="flex-1">{opt}</span>
                    {submitted && isCorrect && (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    )}
                    {submitted && chosen && !isCorrect && (
                      <XCircle className="h-4 w-4 text-danger" />
                    )}
                  </button>
                );
              })}
            </div>
            {submitted && q.pembahasan && (
              <p className="mt-3 rounded-lg bg-black/5 p-3 text-xs text-muted">
                <b>Pembahasan:</b> {q.pembahasan}
              </p>
            )}
          </div>
        ))}

        {!submitted ? (
          <Button
            className="w-full"
            disabled={!allAnswered}
            onClick={handleSubmit}
          >
            Kumpulkan Jawaban
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSubmitted(false);
              setAnswers({});
            }}
          >
            <RotateCcw className="h-4 w-4" /> Ulangi
          </Button>
        )}
      </div>
    </div>
  );
}
