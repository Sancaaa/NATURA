import { notFound } from "next/navigation";
import { getQuizForEdit } from "@/lib/db/quizzes";
import { EditQuizForm } from "@/components/teacher/EditQuizForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quiz = await getQuizForEdit(id);
  if (!quiz) notFound();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold">Edit Kuis</h1>
        <p className="text-sm text-muted">
          Ubah soal, opsi, kunci jawaban, dan pembahasan.
        </p>
      </div>
      <EditQuizForm
        quizId={quiz.id}
        judul={quiz.judul}
        topik={quiz.topik}
        questions={quiz.questions}
      />
    </div>
  );
}
