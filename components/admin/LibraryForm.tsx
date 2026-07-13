"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createLibraryItem,
  updateLibraryItem,
  type LibraryInput,
} from "@/lib/actions/content";
import type { LibraryItem } from "@/lib/data/library";
import { buttonClass } from "@/components/ui/Button";
import { Field, TextInput, TextArea, inputCls } from "@/components/admin/formFields";

export function LibraryForm({ item }: { item?: LibraryItem }) {
  const editing = !!item;
  const [f, setF] = useState<Omit<LibraryInput, "konten">>({
    judul: item?.judul ?? "",
    tipe: item?.tipe ?? "Modul",
    penulis: item?.penulis ?? "",
    ringkasan: item?.ringkasan ?? "",
    offline: item?.offline ?? false,
  });
  // Satu paragraf per baris.
  const [kontenText, setKontenText] = useState(
    (item?.konten ?? []).join("\n\n"),
  );
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const set = (patch: Partial<Omit<LibraryInput, "konten">>) =>
    setF((p) => ({ ...p, ...patch }));

  const submit = () => {
    setErr(null);
    const input: LibraryInput = {
      ...f,
      konten: kontenText
        .split(/\n{2,}/)
        .map((s) => s.trim())
        .filter(Boolean),
    };
    startTransition(async () => {
      const res = editing
        ? await updateLibraryItem(item!.id, input)
        : await createLibraryItem(input);
      if (res.error) {
        setErr(res.error);
        return;
      }
      router.push("/admin/pustaka");
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Judul *">
          <TextInput
            value={f.judul}
            onChange={(e) => set({ judul: e.target.value })}
            placeholder="Pengantar Simplisia"
          />
        </Field>
        <Field label="Tipe">
          <select
            value={f.tipe}
            onChange={(e) =>
              set({ tipe: e.target.value as LibraryInput["tipe"] })
            }
            className={inputCls}
          >
            <option value="Modul">Modul</option>
            <option value="Artikel">Artikel</option>
            <option value="Buku">Buku</option>
          </select>
        </Field>
        <Field label="Penulis">
          <TextInput
            value={f.penulis}
            onChange={(e) => set({ penulis: e.target.value })}
            placeholder="Tim Farmakognosi"
          />
        </Field>
        <Field label="Ketersediaan">
          <label className="flex h-[38px] items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={f.offline}
              onChange={(e) => set({ offline: e.target.checked })}
              className="h-4 w-4"
            />
            Tersedia offline
          </label>
        </Field>
      </div>

      <Field label="Ringkasan">
        <TextArea
          value={f.ringkasan}
          onChange={(e) => set({ ringkasan: e.target.value })}
        />
      </Field>

      <Field label="Konten" hint="Pisahkan tiap paragraf dengan baris kosong">
        <TextArea
          value={kontenText}
          onChange={(e) => setKontenText(e.target.value)}
          className="min-h-48"
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
          {pending ? "Menyimpan…" : editing ? "Simpan Perubahan" : "Tambah Pustaka"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/pustaka")}
          className={buttonClass("outline", "md")}
        >
          Batal
        </button>
      </div>
    </div>
  );
}
