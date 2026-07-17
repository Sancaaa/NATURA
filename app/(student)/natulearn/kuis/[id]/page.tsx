import { notFound } from "next/navigation";
import { getQuizForTaking } from "@/lib/db/quizzes";
import { QuizRunner } from "@/components/student/QuizRunner";
import { QuizIntro } from "@/components/student/QuizIntro";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ assignment?: string; from?: string; start?: string }>;
}) {
  const { id } = await params;
  const { assignment, from, start } = await searchParams;
  const quiz = await getQuizForTaking(id);
  if (!quiz) notFound();

  // Kembali ke tempat siswa berangkat, bukan selalu ke hub.
  const back = assignment
    ? `/natulearn/tugas/${assignment}`
    : from === "harian"
      ? "/natulearn/kuis-harian"
      : "/natulearn";

  // Alur: Detail Kuis (intro) → ?start=1 → soal.
  if (!start) {
    const qs = new URLSearchParams();
    if (assignment) qs.set("assignment", assignment);
    if (from) qs.set("from", from);
    qs.set("start", "1");
    return (
      <QuizIntro
        quiz={quiz}
        back={back}
        startHref={`/natulearn/kuis/${id}?${qs.toString()}`}
      />
    );
  }

  return <QuizRunner quiz={quiz} assignmentId={assignment} back={back} />;
}
