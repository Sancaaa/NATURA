/**
 * Bangun URL viewer AR (halaman A-Frame statis di /public/ar/viewer.html).
 *
 * Viewer-nya data-driven lewat query: `type` + `id` dipakai untuk mengambil
 * anotasi via /api/ar/[type]/[id], sedangkan `model` & `target` menunjuk aset.
 * Tanpa target (.mind) AR tidak bisa jalan → kembalikan null agar pemanggil
 * menyembunyikan tombolnya.
 */
export function arViewerHref(o: {
  type: "plant" | "tool";
  id: string;
  model?: string;
  target?: string;
}): string | null {
  if (!o.target) return null;
  return (
    `/ar/viewer.html?type=${o.type}&id=${encodeURIComponent(o.id)}` +
    (o.model ? `&model=${encodeURIComponent(o.model)}` : "") +
    `&target=${encodeURIComponent(o.target)}`
  );
}
