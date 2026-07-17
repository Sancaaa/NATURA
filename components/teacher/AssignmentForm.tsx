"use client";

import { useActionState, useEffect, useState } from "react";
import { createAssignment, type ActionState } from "@/lib/actions/classroom";
import { Button } from "@/components/ui/Button";
import { AttachmentsField } from "@/components/shared/AttachmentsField";
import type { AssignableQuiz } from "@/lib/db/quizzes";
import type { Attachment } from "@/lib/attachments";

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
  const [lampiran, setLampiran] = useState<Attachment[]>([]);

  // Bersihkan lampiran setelah tugas tersimpan agar tidak terbawa ke tugas
  // berikutnya (form action tidak me-reset state komponen).
  useEffect(() => {
    if (state.ok) setLampiran([]);
  }, [state.ok]);

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

      <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
        <textarea
          name="deskripsi"
          placeholder="Deskripsi tugas untuk siswa (opsional)"
          className="min-h-20 rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <label className="block space-y-1">
          <span className="text-sm font-semibold">Bobot</span>
          <input
            type="number"
            name="bobot"
            min={0}
            max={1000}
            defaultValue={100}
            className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-primary"
          />
        </label>
      </div>

      <AttachmentsField
        name="lampiran"
        value={lampiran}
        onChange={setLampiran}
        hint="Berkas atau tautan pendukung yang bisa dibuka siswa."
      />

      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      {state.ok && <p className="text-sm text-success">{state.ok}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan…" : "Tugaskan"}
      </Button>
    </form>
  );
}
