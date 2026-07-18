"use client";

import { useState } from "react";
import { Plus, X, FileText, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { TextInput, inputCls } from "@/components/admin/formFields";
import type { Attachment } from "@/lib/attachments";

/** Ekstensi yang wajar untuk materi/tugas. */
const ACCEPT = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.zip";

/** Tebak nama tampilan dari URL hasil unggah (`<uuid>-<nama>`) atau tautan. */
function namaDariUrl(url: string): string {
  const path = url.split("?")[0];
  let base = path.slice(path.lastIndexOf("/") + 1);
  try {
    base = decodeURIComponent(base);
  } catch {
    /* biarkan apa adanya bila encoding tidak valid */
  }
  const m = base.match(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-(.+)$/i,
  );
  return m ? m[1] : base || url;
}

/**
 * Editor daftar lampiran (berkas/tautan) untuk guru & admin.
 *
 * Dua mode pemakaian:
 * - Form berbasis server action → beri `name`, nilai dikirim sebagai JSON
 *   lewat hidden input.
 * - Form berbasis state (mis. LibraryForm) → cukup `value` + `onChange`.
 */
export function AttachmentsField({
  value,
  onChange,
  name,
  label = "Lampiran",
  hint = "Berkas atau tautan pendukung untuk siswa.",
}: {
  value: Attachment[];
  onChange: (next: Attachment[]) => void;
  name?: string;
  label?: string;
  hint?: string;
}) {
  const [tipe, setTipe] = useState<Attachment["tipe"]>("file");
  const [url, setUrl] = useState("");
  const [nama, setNama] = useState("");

  const bisaTambah = url.trim().length > 0;

  function tambah() {
    const u = url.trim();
    if (!u) return;
    onChange([
      ...value,
      { nama: nama.trim() || namaDariUrl(u), url: u, tipe },
    ]);
    setUrl("");
    setNama("");
  }

  function hapus(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  function ubahNama(i: number, nextNama: string) {
    onChange(
      value.map((a, idx) => (idx === i ? { ...a, nama: nextNama } : a)),
    );
  }

  return (
    <div className="space-y-2">
      <div>
        <span className="text-sm font-semibold">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </div>

      {name && (
        <input type="hidden" name={name} value={JSON.stringify(value)} />
      )}

      {/* Daftar lampiran yang sudah ada - nama bisa disunting. */}
      {value.length > 0 && (
        <ul className="divide-y divide-line rounded-lg border border-line">
          {value.map((a, i) => (
            <li key={`${a.url}-${i}`} className="flex items-center gap-2 p-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                {a.tipe === "file" ? (
                  <FileText className="h-4 w-4" />
                ) : (
                  <LinkIcon className="h-4 w-4" />
                )}
              </span>
              <span className="min-w-0 flex-1 space-y-0.5">
                <TextInput
                  value={a.nama}
                  onChange={(e) => ubahNama(i, e.target.value)}
                  className="py-1"
                  aria-label="Nama lampiran"
                />
                <span className="block truncate text-[11px] text-muted">
                  {a.url}
                </span>
              </span>
              <button
                type="button"
                onClick={() => hapus(i)}
                aria-label={`Hapus ${a.nama}`}
                className="shrink-0 rounded-md p-1.5 text-danger hover:bg-danger/10"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Baris tambah */}
      <div className="space-y-2 rounded-lg border border-dashed border-line p-2">
        <div className="flex gap-1">
          {(["file", "link"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTipe(t);
                setUrl("");
              }}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-semibold",
                tipe === t
                  ? "bg-primary text-white"
                  : "bg-black/5 text-muted hover:bg-black/10",
              )}
            >
              {t === "file" ? "Berkas" : "Tautan"}
            </button>
          ))}
        </div>

        {tipe === "file" ? (
          <FileUploadField
            label="Unggah berkas"
            accept={ACCEPT}
            folder="lampiran"
            value={url}
            onChange={setUrl}
          />
        ) : (
          <label className="block space-y-1">
            <span className="text-sm font-semibold">URL tautan</span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              className={inputCls}
            />
          </label>
        )}

        <label className="block space-y-1">
          <span className="text-sm font-semibold">Nama tampilan</span>
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Otomatis dari berkas/tautan bila dikosongkan"
            className={inputCls}
          />
        </label>

        <button
          type="button"
          onClick={tambah}
          disabled={!bisaTambah}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium hover:bg-black/5 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Tambah lampiran
        </button>
      </div>
    </div>
  );
}
