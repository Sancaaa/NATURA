"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Check } from "lucide-react";
import { QuizDraftEditor } from "@/components/teacher/QuizDraftEditor";
import {
  generateQuiz,
  publishQuiz,
  type DraftQuestion,
} from "@/lib/actions/quiz";

export default function BuatKuis() {
  const [topik, setTopik] = useState("");
  const [judul, setJudul] = useState("");
  const [jumlah, setJumlah] = useState(3);
  const [draft, setDraft] = useState<DraftQuestion[] | null>(null);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [genPending, startGen] = useTransition();
  const [pubPending, startPub] = useTransition();

  function generate() {
    setError(null);
    setPublished(false);
    setDraft(null);
    startGen(async () => {
      const res = await generateQuiz(topik, jumlah);
      if (res.error) setError(res.error);
      else setDraft(res.questions ?? []);
    });
  }

  function publish() {
    if (!draft) return;
    setError(null);
    startPub(async () => {
      const res = await publishQuiz(
        judul || `Kuis: ${topik || "Farmakognosi"}`,
        topik,
        draft,
      );
      if (res.error) setError(res.error);
      else setPublished(true);
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Buat Kuis</h1>
        <p className="text-sm text-muted">
          Buat draf soal secara otomatis, tinjau, lalu publikasikan agar
          bisa ditugaskan ke kelas.
        </p>
      </div>

      <Card className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Topik</span>
            <input
              value={topik}
              onChange={(e) => setTopik(e.target.value)}
              placeholder="mis. Metode ekstraksi"
              className="h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">
              Judul kuis (opsional)
            </span>
            <input
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Otomatis dari topik"
              className="h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-primary"
            />
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Jumlah soal</span>
          <input
            type="number"
            min={1}
            max={10}
            value={jumlah}
            onChange={(e) => setJumlah(Number(e.target.value))}
            className="h-11 w-28 rounded-xl border border-line px-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <Button onClick={generate} disabled={genPending}>
          <Sparkles className="h-4 w-4" />
          {genPending ? "Menyusun…" : "Buat Soal Otomatis"}
        </Button>
        {error && <p className="text-sm text-danger">{error}</p>}
        <p className="text-xs text-muted">
          Draf soal akan ditampilkan untuk ditinjau sebelum dipublikasikan.
        </p>
      </Card>

      {draft && (
        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="flex-1 font-bold">
              Tinjau &amp; Edit Draf ({draft.length} soal)
            </h2>
            {published ? (
              <Badge tone="success">
                <Check className="mr-1 h-3 w-3" /> Dipublikasikan
              </Badge>
            ) : (
              <Badge tone="accent">Belum dipublikasikan</Badge>
            )}
          </div>
          <QuizDraftEditor value={draft} onChange={setDraft} />
          {published ? (
            <div className="rounded-xl bg-success/10 p-3 text-sm">
              Kuis tersimpan. Kelola di{" "}
              <Link
                href="/bank-soal"
                className="font-semibold text-primary underline"
              >
                Bank Soal
              </Link>{" "}
              atau tugaskan lewat{" "}
              <Link
                href="/kelas"
                className="font-semibold text-primary underline"
              >
                Kelas
              </Link>
              .
            </div>
          ) : (
            <Button onClick={publish} disabled={pubPending} className="w-full">
              {pubPending ? "Menyimpan…" : "Publikasikan"}
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
