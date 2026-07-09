"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Check } from "lucide-react";
import { quizzes } from "@/lib/data/quizzes";

export default function BuatKuis() {
  const [topik, setTopik] = useState("Pengantar Simplisia");
  const [jumlah, setJumlah] = useState(3);
  const [state, setState] = useState<
    "idle" | "loading" | "draft" | "published"
  >("idle");

  const draft = quizzes[0].questions;

  function generate() {
    setState("loading");
    setTimeout(() => setState("draft"), 1200);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Buat Kuis</h1>
        <p className="text-sm text-muted">
          Susun manual atau hasilkan draf dengan AI (Gemini), lalu tinjau
          sebelum publikasi.
        </p>
      </div>

      <Card className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Topik</label>
          <input
            value={topik}
            onChange={(e) => setTopik(e.target.value)}
            className="h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Jumlah soal</label>
          <input
            type="number"
            min={1}
            max={10}
            value={jumlah}
            onChange={(e) => setJumlah(Number(e.target.value))}
            className="h-11 w-28 rounded-xl border border-line px-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <Button onClick={generate} disabled={state === "loading"}>
          <Sparkles className="h-4 w-4" />
          {state === "loading" ? "Menyusun…" : "Generate dengan AI"}
        </Button>
        <p className="text-xs text-muted">
          Catatan: pada mockup, draf memakai contoh statis. Di produksi ini
          memanggil Gemini dengan output terstruktur.
        </p>
      </Card>

      {(state === "draft" || state === "published") && (
        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="flex-1 font-bold">Draf Soal ({draft.length})</h2>
            {state === "published" ? (
              <Badge tone="success">
                <Check className="mr-1 h-3 w-3" /> Dipublikasikan
              </Badge>
            ) : (
              <Badge tone="accent">Perlu ditinjau</Badge>
            )}
          </div>
          <div className="space-y-3">
            {draft.map((q, i) => (
              <div key={q.id} className="rounded-xl border border-line p-3">
                <div className="text-sm font-semibold">
                  {i + 1}. {q.pertanyaan}
                </div>
                <ul className="mt-2 space-y-1 text-sm">
                  {q.opsi.map((o, oi) => (
                    <li
                      key={oi}
                      className={
                        oi === q.kunci
                          ? "font-medium text-success"
                          : "text-muted"
                      }
                    >
                      {oi === q.kunci ? "✓ " : "• "}
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {state === "draft" && (
            <Button onClick={() => setState("published")} className="w-full">
              Publikasikan ke Kelas
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
