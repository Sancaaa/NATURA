"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteQuiz } from "@/lib/actions/quiz";

export function DeleteQuizButton({
  quizId,
  judul,
}: {
  quizId: string;
  judul: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Hapus kuis "${judul}"? Tindakan ini permanen.`)) return;
        startTransition(async () => {
          const res = await deleteQuiz(quizId);
          if (res.error) alert(res.error);
          router.refresh();
        });
      }}
      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-danger hover:bg-danger/10 disabled:opacity-50"
      aria-label={`Hapus ${judul}`}
    >
      <Trash2 className="h-4 w-4" />
      {pending ? "Menghapus…" : "Hapus"}
    </button>
  );
}
