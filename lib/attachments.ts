/**
 * Lampiran (file/link pendukung) untuk modul materi & tugas guru.
 * Disimpan sebagai jsonb array di `library_items.lampiran` dan
 * `assignments.lampiran`.
 */
export type Attachment = {
  nama: string;
  url: string;
  tipe: "file" | "link";
};

/**
 * Baca lampiran dari nilai jsonb secara defensif — data lama/rusak tidak
 * boleh menjatuhkan halaman. Baris tanpa `url` dibuang; `nama` kosong
 * jatuh ke url-nya sendiri agar tetap ada label yang bisa diklik.
 */
export function parseAttachments(v: unknown): Attachment[] {
  if (!Array.isArray(v)) return [];
  const out: Attachment[] = [];
  for (const raw of v) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const url = typeof r.url === "string" ? r.url.trim() : "";
    if (!url) continue;
    const nama = typeof r.nama === "string" && r.nama.trim() ? r.nama.trim() : url;
    out.push({ nama, url, tipe: r.tipe === "file" ? "file" : "link" });
  }
  return out;
}
