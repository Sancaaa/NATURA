"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTool, updateTool, type ToolInput } from "@/lib/actions/content";
import type { LabTool } from "@/lib/data/tools";
import { buttonClass } from "@/components/ui/Button";
import { Field, TextInput, TextArea } from "@/components/admin/formFields";

export function ToolForm({ tool }: { tool?: LabTool }) {
  const editing = !!tool;
  const [f, setF] = useState<ToolInput>({
    nama: tool?.nama ?? "",
    fungsi: tool?.fungsi ?? "",
    caraPakai: tool?.caraPakai ?? "",
    keselamatan: tool?.keselamatan ?? "",
    model3dUrl: tool?.model3dUrl ?? "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const set = (patch: Partial<ToolInput>) => setF((p) => ({ ...p, ...patch }));

  const submit = () => {
    setErr(null);
    startTransition(async () => {
      const res = editing
        ? await updateTool(tool!.id, f)
        : await createTool(f);
      if (res.error) {
        setErr(res.error);
        return;
      }
      router.push("/admin/alat");
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <Field label="Nama alat *">
        <TextInput
          value={f.nama}
          onChange={(e) => set({ nama: e.target.value })}
          placeholder="Mikroskop"
        />
      </Field>
      <Field label="Fungsi">
        <TextArea
          value={f.fungsi}
          onChange={(e) => set({ fungsi: e.target.value })}
        />
      </Field>
      <Field label="Cara pakai">
        <TextArea
          value={f.caraPakai}
          onChange={(e) => set({ caraPakai: e.target.value })}
        />
      </Field>
      <Field label="Keselamatan">
        <TextArea
          value={f.keselamatan}
          onChange={(e) => set({ keselamatan: e.target.value })}
        />
      </Field>
      <Field label="URL model 3D (.glb)" hint="Opsional">
        <TextInput
          value={f.model3dUrl}
          onChange={(e) => set({ model3dUrl: e.target.value })}
          placeholder="/models/mikroskop.glb"
        />
      </Field>

      {err && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {err}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className={buttonClass("primary", "md")}
        >
          {pending ? "Menyimpan…" : editing ? "Simpan Perubahan" : "Tambah Alat"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/alat")}
          className={buttonClass("outline", "md")}
        >
          Batal
        </button>
      </div>
    </div>
  );
}
