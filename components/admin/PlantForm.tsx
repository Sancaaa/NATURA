"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPlant, updatePlant, type PlantInput } from "@/lib/actions/content";
import type { Plant } from "@/lib/data/plants";
import { buttonClass } from "@/components/ui/Button";
import { Field, TextInput, TextArea } from "@/components/admin/formFields";
import { FileUploadField } from "@/components/admin/FileUploadField";

export function PlantForm({ plant }: { plant?: Plant }) {
  const editing = !!plant;
  const [f, setF] = useState<PlantInput>({
    namaLokal: plant?.namaLokal ?? "",
    namaLatin: plant?.namaLatin ?? "",
    familia: plant?.familia ?? "",
    bagianDigunakan: plant?.bagianDigunakan ?? "",
    namaSimplisia: plant?.namaSimplisia ?? "",
    kandungan: plant?.kandungan ?? [],
    khasiat: plant?.khasiat ?? "",
    makroskopik: plant?.makroskopik ?? "",
    mikroskopik: plant?.mikroskopik ?? "",
    model3dUrl: plant?.model3dUrl ?? "",
    arTargetUrl: plant?.arTargetUrl ?? "",
    arIntro: plant?.arIntro ?? "",
    gambarUrl: plant?.gambarUrl ?? "",
  });
  const [kandunganText, setKandunganText] = useState(
    (plant?.kandungan ?? []).join(", "),
  );
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const set = (patch: Partial<PlantInput>) => setF((p) => ({ ...p, ...patch }));

  const submit = () => {
    setErr(null);
    const input: PlantInput = {
      ...f,
      kandungan: kandunganText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    startTransition(async () => {
      const res = editing
        ? await updatePlant(plant!.id, input)
        : await createPlant(input);
      if (res.error) {
        setErr(res.error);
        return;
      }
      router.push("/admin/tanaman");
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nama lokal *">
          <TextInput
            value={f.namaLokal}
            onChange={(e) => set({ namaLokal: e.target.value })}
            placeholder="Sambiloto"
          />
        </Field>
        <Field label="Nama latin *">
          <TextInput
            value={f.namaLatin}
            onChange={(e) => set({ namaLatin: e.target.value })}
            placeholder="Andrographis paniculata"
          />
        </Field>
        <Field label="Familia">
          <TextInput
            value={f.familia}
            onChange={(e) => set({ familia: e.target.value })}
            placeholder="Acanthaceae"
          />
        </Field>
        <Field label="Bagian digunakan">
          <TextInput
            value={f.bagianDigunakan}
            onChange={(e) => set({ bagianDigunakan: e.target.value })}
            placeholder="Herba, Daun, Rimpang…"
          />
        </Field>
        <Field label="Nama simplisia">
          <TextInput
            value={f.namaSimplisia}
            onChange={(e) => set({ namaSimplisia: e.target.value })}
            placeholder="Andrographidis Herba"
          />
        </Field>
        <Field label="Kandungan" hint="Pisahkan dengan koma">
          <TextInput
            value={kandunganText}
            onChange={(e) => setKandunganText(e.target.value)}
            placeholder="Andrografolid, Flavonoid"
          />
        </Field>
      </div>

      <Field label="Khasiat">
        <TextArea
          value={f.khasiat}
          onChange={(e) => set({ khasiat: e.target.value })}
        />
      </Field>
      <Field label="Ciri makroskopik">
        <TextArea
          value={f.makroskopik}
          onChange={(e) => set({ makroskopik: e.target.value })}
        />
      </Field>
      <Field label="Ciri mikroskopik">
        <TextArea
          value={f.mikroskopik}
          onChange={(e) => set({ mikroskopik: e.target.value })}
        />
      </Field>

      <div>
        {f.gambarUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={f.gambarUrl}
            alt="Preview tanaman"
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
          hint="Opsional — untuk mode 3D & AR"
          accept=".glb"
          folder="models"
          value={f.model3dUrl ?? ""}
          onChange={(url) => set({ model3dUrl: url })}
        />
        <FileUploadField
          label="Target AR (.mind)"
          hint="Opsional — mengaktifkan pindai kamera"
          accept=".mind"
          folder="ar-targets"
          value={f.arTargetUrl ?? ""}
          onChange={(url) => set({ arTargetUrl: url })}
        />
      </div>

      <Field
        label="Intro AR"
        hint="Paragraf pembuka di overlay AR saat model diketuk. Kosongkan untuk memakai Khasiat."
      >
        <TextArea
          value={f.arIntro ?? ""}
          onChange={(e) => set({ arIntro: e.target.value })}
          placeholder="Herba pahit dari famili Acanthaceae; simplisianya mengandung andrografolid…"
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
          {pending ? "Menyimpan…" : editing ? "Simpan Perubahan" : "Tambah Tanaman"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/tanaman")}
          className={buttonClass("outline", "md")}
        >
          Batal
        </button>
      </div>
    </div>
  );
}
