"use client";

import type { DraftQuestion } from "@/lib/actions/quiz";
import { Trash2, Plus } from "lucide-react";

const inputCls =
  "w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary";

export function QuizDraftEditor({
  value,
  onChange,
}: {
  value: DraftQuestion[];
  onChange: (d: DraftQuestion[]) => void;
}) {
  const update = (i: number, patch: Partial<DraftQuestion>) =>
    onChange(value.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));

  const setOption = (i: number, oi: number, val: string) =>
    update(i, { opsi: value[i].opsi.map((o, k) => (k === oi ? val : o)) });

  const addOption = (i: number) => {
    if (value[i].opsi.length >= 6) return;
    update(i, { opsi: [...value[i].opsi, ""] });
  };

  const removeOption = (i: number, oi: number) => {
    const q = value[i];
    if (q.opsi.length <= 2) return;
    const opsi = q.opsi.filter((_, k) => k !== oi);
    let kunci = q.kunci;
    if (oi === q.kunci) kunci = 0;
    else if (oi < q.kunci) kunci = q.kunci - 1;
    update(i, { opsi, kunci });
  };

  const deleteQuestion = (i: number) =>
    onChange(value.filter((_, idx) => idx !== i));

  const addQuestion = () =>
    onChange([
      ...value,
      { pertanyaan: "", opsi: ["", "", "", ""], kunci: 0, pembahasan: "" },
    ]);

  return (
    <div className="space-y-4">
      {value.map((q, i) => (
        <div key={i} className="space-y-3 rounded-xl border border-line p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">Soal {i + 1}</span>
            <button
              type="button"
              onClick={() => deleteQuestion(i)}
              className="ml-auto text-danger"
              aria-label="Hapus soal"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <textarea
            value={q.pertanyaan}
            onChange={(e) => update(i, { pertanyaan: e.target.value })}
            placeholder="Tulis pertanyaan…"
            rows={2}
            className={inputCls}
          />

          <div className="space-y-2">
            {q.opsi.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`kunci-${i}`}
                  checked={q.kunci === oi}
                  onChange={() => update(i, { kunci: oi })}
                  title="Tandai jawaban benar"
                  className="h-4 w-4 accent-primary"
                />
                <input
                  value={opt}
                  onChange={(e) => setOption(i, oi, e.target.value)}
                  placeholder={`Opsi ${oi + 1}`}
                  className={inputCls}
                />
                {q.opsi.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(i, oi)}
                    className="px-1 text-lg leading-none text-muted"
                    aria-label="Hapus opsi"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {q.opsi.length < 6 && (
              <button
                type="button"
                onClick={() => addOption(i)}
                className="text-xs font-medium text-primary"
              >
                + Tambah opsi
              </button>
            )}
          </div>

          <input
            value={q.pembahasan}
            onChange={(e) => update(i, { pembahasan: e.target.value })}
            placeholder="Pembahasan (opsional)"
            className={inputCls}
          />
          <p className="text-xs text-muted">
            Pilih radio pada opsi yang benar.
          </p>
        </div>
      ))}

      <button
        type="button"
        onClick={addQuestion}
        className="flex items-center gap-1 rounded-xl border border-dashed border-line px-3 py-2 text-sm font-medium text-primary"
      >
        <Plus className="h-4 w-4" /> Tambah soal
      </button>
    </div>
  );
}
