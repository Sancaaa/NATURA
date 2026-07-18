"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowUp, ArrowDown, MousePointerClick } from "lucide-react";
import {
  saveAnnotations,
  type AnnotationInput,
  type SubjectType,
} from "@/lib/actions/annotations";
import { Card } from "@/components/ui/Card";
import { buttonClass } from "@/components/ui/Button";
import { inputCls } from "@/components/admin/formFields";

const AnnotationPicker = dynamic(
  () => import("@/components/admin/AnnotationPicker"),
  { ssr: false },
);

type Vec = [number, number, number];

function NumTriple({
  value,
  onChange,
}: {
  value: Vec;
  onChange: (v: Vec) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {(["x", "y", "z"] as const).map((axis, k) => (
        <label key={axis} className="flex items-center gap-1">
          <span className="text-xs text-muted">{axis}</span>
          <input
            type="number"
            step="0.01"
            value={value[k]}
            onChange={(e) => {
              const v = [...value] as Vec;
              v[k] = parseFloat(e.target.value) || 0;
              onChange(v);
            }}
            className={`${inputCls} px-2 py-1`}
          />
        </label>
      ))}
    </div>
  );
}

const blank = (): AnnotationInput => ({
  label: "",
  body: [],
  pos: [0, 0.1, 0.1],
  labelPos: [0.25, 0.1, 0],
});

export function AnnotationsEditor({
  subjectType,
  subjectId,
  subjectName,
  modelSrc,
  initial,
}: {
  subjectType: SubjectType;
  subjectId: string;
  subjectName: string;
  modelSrc?: string;
  initial: AnnotationInput[];
}) {
  const [items, setItems] = useState<AnnotationInput[]>(initial);
  const [sel, setSel] = useState(initial.length ? 0 : -1);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const patch = (i: number, p: Partial<AnnotationInput>) =>
    setItems((arr) => arr.map((it, idx) => (idx === i ? { ...it, ...p } : it)));

  const add = () => {
    setItems((arr) => [...arr, blank()]);
    setSel(items.length);
  };
  const remove = (i: number) => {
    setItems((arr) => arr.filter((_, idx) => idx !== i));
    setSel((s) => (s >= i ? Math.max(-1, s - 1) : s));
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    setItems((arr) => {
      const next = [...arr];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setSel(j);
  };

  const save = () => {
    setErr(null);
    setOk(null);
    startTransition(async () => {
      const res = await saveAnnotations(subjectType, subjectId, items);
      if (res.error) {
        setErr(res.error);
        return;
      }
      setOk("Titik highlight tersimpan.");
      router.refresh();
    });
  };

  const points = items.map((it) => ({ pos: it.pos, labelPos: it.labelPos }));

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Penampil 3D + klik-untuk-tempat */}
      <div className="lg:sticky lg:top-4 lg:self-start">
        <Card className="p-2">
          <div className="h-80 overflow-hidden rounded-xl border border-line">
            <AnnotationPicker
              src={modelSrc}
              points={points}
              selected={sel}
              onPick={(pos) => sel >= 0 && patch(sel, { pos })}
              onLabelMove={(labelPos) => sel >= 0 && patch(sel, { labelPos })}
              className="h-full w-full"
            />
          </div>
          <p className="flex items-center gap-1.5 px-1 pt-2 text-xs text-muted">
            <MousePointerClick className="h-3.5 w-3.5" />
            {sel >= 0
              ? "Klik model untuk menaruh titik; seret bulatan label (hijau) untuk memindah label; seret area kosong untuk memutar."
              : "Tambah titik dulu, lalu klik model untuk menaruhnya."}
          </p>
        </Card>
      </div>

      {/* Daftar titik */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted">
            {items.length} titik untuk <b>{subjectName}</b>
          </div>
          <button
            type="button"
            onClick={add}
            className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-primary hover:bg-primary/10"
          >
            <Plus className="h-4 w-4" /> Tambah titik
          </button>
        </div>

        {items.length === 0 && (
          <Card className="text-sm text-muted">
            Belum ada titik. Klik “Tambah titik”.
          </Card>
        )}

        {items.map((it, i) => (
          <Card
            key={i}
            onClick={() => setSel(i)}
            className={`space-y-2 ${
              sel === i ? "ring-2 ring-primary" : "cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted">#{i + 1}</span>
              <input
                value={it.label}
                onChange={(e) => patch(i, { label: e.target.value })}
                placeholder="Label (mis. Daun)"
                className={`${inputCls} flex-1 px-2 py-1 font-semibold`}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  move(i, -1);
                }}
                className="text-muted hover:text-ink disabled:opacity-30"
                disabled={i === 0}
                aria-label="Naik"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  move(i, 1);
                }}
                className="text-muted hover:text-ink disabled:opacity-30"
                disabled={i === items.length - 1}
                aria-label="Turun"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(i);
                }}
                className="text-danger"
                aria-label="Hapus"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <textarea
              value={it.body.join("\n")}
              onChange={(e) => patch(i, { body: e.target.value.split("\n") })}
              placeholder="Penjelasan - satu poin per baris"
              className={`${inputCls} min-h-16 px-2 py-1`}
            />

            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <div className="mb-1 text-xs font-semibold text-muted">
                  Titik (pos)
                </div>
                <NumTriple value={it.pos} onChange={(v) => patch(i, { pos: v })} />
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold text-muted">
                  Offset label
                </div>
                <NumTriple
                  value={it.labelPos}
                  onChange={(v) => patch(i, { labelPos: v })}
                />
              </div>
            </div>
          </Card>
        ))}

        {err && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {err}
          </p>
        )}
        {ok && (
          <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
            {ok}
          </p>
        )}

        <button
          type="button"
          onClick={save}
          disabled={pending}
          className={`${buttonClass("primary", "md")} w-full`}
        >
          {pending ? "Menyimpan…" : "Simpan Titik Highlight"}
        </button>
      </div>
    </div>
  );
}
