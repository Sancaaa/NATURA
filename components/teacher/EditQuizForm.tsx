"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QuizDraftEditor } from "./QuizDraftEditor";
import { updateQuiz, type DraftQuestion } from "@/lib/actions/quiz";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const inputCls =
  "h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-primary";

export function EditQuizForm({
  quizId,
  judul: j0,
  topik: t0,
  questions: q0,
}: {
  quizId: string;
  judul: string;
  topik: string | null;
  questions: DraftQuestion[];
}) {
  const [judul, setJudul] = useState(j0);
  const [topik, setTopik] = useState(t0 ?? "");
  const [draft, setDraft] = useState<DraftQuestion[]>(q0);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function save() {
    setError(null);
    setOk(false);
    startTransition(async () => {
      const res = await updateQuiz(quizId, judul, topik, draft);
      if (res.error) setError(res.error);
      else {
        setOk(true);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Judul</span>
            <input
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Topik</span>
            <input
              value={topik}
              onChange={(e) => setTopik(e.target.value)}
              className={inputCls}
            />
          </label>
        </div>
      </Card>

      <QuizDraftEditor value={draft} onChange={setDraft} />

      {error && <p className="text-sm text-danger">{error}</p>}
      {ok && <p className="text-sm text-success">Perubahan tersimpan.</p>}

      <div className="flex gap-2">
        <Button onClick={save} disabled={pending}>
          {pending ? "Menyimpan…" : "Simpan Perubahan"}
        </Button>
        <Link
          href="/bank-soal"
          className="inline-flex h-11 items-center rounded-xl border border-line px-4 text-sm font-semibold"
        >
          Kembali
        </Link>
      </div>
    </div>
  );
}
