"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTool, updateTool, type ToolInput } from "@/lib/actions/content";
import type { LabTool } from "@/lib/data/tools";
import { buttonClass } from "@/components/ui/Button";
import { Field, TextInput, TextArea } from "@/components/admin/formFields";
import { FileUploadField } from "@/components/admin/FileUploadField";

export function ToolForm({ tool }: { tool?: LabTool }) {
  const editing = !!tool;
  const [f, setF] = useState<ToolInput>({
    nama: tool?.nama ?? "",
    fungsi: tool?.fungsi ?? "",
    caraPakai: tool?.caraPakai ?? "",
    keselamatan: tool?.keselamatan ?? "",
    model3dUrl: tool?.model3dUrl ?? "",
    arTargetUrl: tool?.arTargetUrl ?? "",
    arIntro: tool?.arIntro ?? "",
    gambarUrl: tool?.gambarUrl ?? "",
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

      <div>
        {f.gambarUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={f.gambarUrl}
            alt="Preview alat"
            className="mb-2 h-32 w-full max-w-xs rounded-2xl border border-line object-cover"
          />
        )}
        <FileUploadField
          label="Gambar preview"
          hint="Foto untuk kartu jelajah (JPG/PNG/WebP). Kosongkan untuk memakai emoji."
          accept=".png,.jpg,.jpeg,.webp"
          folder="images"
          value={f.gambarUrl ?? ""}
          onChange={(url) => set({ gambarUrl: url })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FileUploadField
          label="Model 3D (.glb)"
          hint="Opsional - untuk mode 3D & AR"
          accept=".glb"
          folder="models"
          value={f.model3dUrl ?? ""}
          onChange={(url) => set({ model3dUrl: url })}
        />
        <FileUploadField
          label="Target AR (.mind)"
          hint="Opsional - mengaktifkan pindai kamera"
          accept=".mind"
          folder="ar-targets"
          value={f.arTargetUrl ?? ""}
          onChange={(url) => set({ arTargetUrl: url })}
        />
      </div>

      <Field
        label="Intro AR"
        hint="Paragraf pembuka di overlay AR saat model diketuk. Kosongkan untuk memakai Fungsi."
      >
        <TextArea
          value={f.arIntro ?? ""}
          onChange={(e) => set({ arIntro: e.target.value })}
          placeholder="Alat untuk mengamati fragmen pengenal simplisia secara mikroskopik…"
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
