import { notFound } from "next/navigation";
import { getQuizForTaking } from "@/lib/db/quizzes";
import { QuizRunner } from "@/components/student/QuizRunner";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ assignment?: string }>;
}) {
  const { id } = await params;
  const { assignment } = await searchParams;
  const quiz = await getQuizForTaking(id);
  if (!quiz) notFound();
  return <QuizRunner quiz={quiz} assignmentId={assignment} />;
}
