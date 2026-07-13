"use client";

import { useActionState } from "react";
import { createAssignment, type ActionState } from "@/lib/actions/classroom";
import { Button } from "@/components/ui/Button";
import type { AssignableQuiz } from "@/lib/db/quizzes";

export function AssignmentForm({
  classId,
  quizzes,
}: {
  classId: string;
  quizzes: AssignableQuiz[];
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createAssignment,
    {},
  );
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="class_id" value={classId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          name="quiz_id"
          required
          defaultValue=""
          className="h-11 rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-primary"
        >
          <option value="" disabled>
            {quizzes.length ? "Pilih kuis…" : "Belum ada kuis — buat dulu"}
          </option>
          {quizzes.map((q) => (
            <option key={q.id} value={q.id}>
              {q.judul}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="deadline"
          className="h-11 rounded-xl border border-line px-3 text-sm outline-none focus:border-primary"
        />
      </div>
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      {state.ok && <p className="text-sm text-success">{state.ok}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan…" : "Tugaskan"}
      </Button>
    </form>
  );
}
