import { notFound } from "next/navigation";
import { getQuizForTaking } from "@/lib/db/quizzes";
import { QuizRunner } from "@/components/student/QuizRunner";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ assignment?: string; from?: string }>;
}) {
  const { id } = await params;
  const { assignment, from } = await searchParams;
  const quiz = await getQuizForTaking(id);
  if (!quiz) notFound();

  // Kembali ke tempat siswa berangkat, bukan selalu ke hub.
  const back = assignment
    ? `/natulearn/tugas/${assignment}`
    : from === "harian"
      ? "/natulearn/kuis-harian"
      : "/natulearn";

  return <QuizRunner quiz={quiz} assignmentId={assignment} back={back} />;
}
