"use client";

import { useRef, useState } from "react";
import { Upload, X, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Field, TextInput } from "@/components/admin/formFields";

const MAX_BYTES = 50 * 1024 * 1024; // 50 MiB (samakan dengan bucket)

/** Nama file aman untuk key storage. */
function safeName(name: string): string {
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot).toLowerCase() : "";
  const base = (dot >= 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "file";
  return `${base}${ext}`;
}

/**
 * Field unggah berkas ke Supabase Storage (bucket publik 'assets').
 * Unggah langsung dari browser (melewati batas ~1MB server action) lalu
 * simpan URL publik ke state form. Tetap sediakan input URL manual.
 */
export function FileUploadField({
  label,
  hint,
  accept,
  folder,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  /** Satu ekstensi (".glb") atau daftar (".pdf,.docx,.png"). */
  accept: string;
  folder: string; // mis. "models", "ar-targets", atau "lampiran"
  value: string;
  onChange: (url: string) => void;
}) {
  const exts = accept
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  // Daftar panjang tak enak dibaca di tombol → sebut "berkas" saja.
  const acceptLabel = exts.length === 1 ? exts[0] : "berkas";
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // izinkan pilih file sama lagi
    if (!file) return;
    setErr(null);

    if (!isSupabaseConfigured) {
      setErr("Aktifkan Supabase untuk mengunggah berkas.");
      return;
    }
    const name = file.name.toLowerCase();
    if (exts.length && !exts.some((ext) => name.endsWith(ext))) {
      setErr(`Berkas harus berekstensi ${exts.join(" / ")}.`);
      return;
    }
    if (file.size > MAX_BYTES) {
      setErr("Ukuran berkas melebihi 50 MB.");
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      const key = `${folder}/${crypto.randomUUID()}-${safeName(file.name)}`;
      const { error } = await supabase.storage
        .from("assets")
        .upload(key, file, { cacheControl: "3600", upsert: false });
      if (error) {
        setErr(error.message);
        return;
      }
      const { data } = supabase.storage.from("assets").getPublicUrl(key);
      onChange(data.publicUrl);
      setFileName(file.name);
    } catch {
      setErr("Gagal mengunggah. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={onPick}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium hover:bg-black/5 disabled:opacity-50"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {busy ? "Mengunggah…" : `Unggah ${acceptLabel}`}
          </button>
          {value && !busy && (
            <span className="inline-flex items-center gap-1 text-xs text-success">
              <Check className="h-3.5 w-3.5" />
              {fileName ?? "Tersimpan"}
            </span>
          )}
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setFileName(null);
              }}
              className="ml-auto inline-flex items-center gap-1 text-xs text-danger hover:underline"
            >
              <X className="h-3.5 w-3.5" /> Hapus
            </button>
          )}
        </div>

        {/* URL manual / hasil unggah (bisa disunting langsung) */}
        <TextInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`URL ${acceptLabel} atau unggah di atas`}
        />
        {err && <p className="text-xs text-danger">{err}</p>}
      </div>
    </Field>
  );
}
