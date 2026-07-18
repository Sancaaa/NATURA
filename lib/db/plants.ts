import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { plants as seedPlants, type Plant } from "@/lib/data/plants";

export type { Plant };

const BASE_COLS =
  "id, nama_lokal, nama_latin, familia, bagian_digunakan, nama_simplisia, kandungan, khasiat, makroskopik, mikroskopik, model_3d_url, ar_target_url, ar_intro";
const COLS = `${BASE_COLS}, gambar_url`;

/* eslint-disable @typescript-eslint/no-explicit-any */
function toPlant(r: any): Plant {
  return {
    id: r.id,
    namaLokal: r.nama_lokal ?? "",
    namaLatin: r.nama_latin ?? "",
    familia: r.familia ?? "",
    bagianDigunakan: r.bagian_digunakan ?? "",
    namaSimplisia: r.nama_simplisia ?? "",
    kandungan: (r.kandungan as string[]) ?? [],
    khasiat: r.khasiat ?? "",
    makroskopik: r.makroskopik ?? "",
    mikroskopik: r.mikroskopik ?? "",
    model3dUrl: r.model_3d_url ?? undefined,
    arTargetUrl: r.ar_target_url ?? undefined,
    arIntro: r.ar_intro ?? undefined,
    gambarUrl: r.gambar_url ?? undefined,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Daftar tanaman (DB bila tersedia; jatuh ke data contoh bila tidak). */
export async function getPlants(): Promise<Plant[]> {
  if (!isSupabaseConfigured) return seedPlants;
  const supabase = await createClient();
  // Coba dengan gambar_url; bila kolom belum ada (migration belum jalan),
  // ulang tanpa kolom itu agar daftar tetap tampil.
  const res = await supabase
    .from("plants")
    .select(COLS)
    .order("nama_lokal", { ascending: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rows: any[] | null = res.data;
  if (res.error) {
    rows = (
      await supabase
        .from("plants")
        .select(BASE_COLS)
        .order("nama_lokal", { ascending: true })
    ).data;
  }
  return (rows ?? []).map(toPlant);
}

/** Satu tanaman berdasarkan id (DB dulu, lalu data contoh). */
export async function getPlantDb(id: string): Promise<Plant | null> {
  if (!isSupabaseConfigured)
    return seedPlants.find((p) => p.id === id) ?? null;
  const supabase = await createClient();
  const res = await supabase.from("plants").select(COLS).eq("id", id).maybeSingle();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let row: any = res.data;
  if (res.error) {
    row = (
      await supabase.from("plants").select(BASE_COLS).eq("id", id).maybeSingle()
    ).data;
  }
  if (!row) return seedPlants.find((p) => p.id === id) ?? null;
  return toPlant(row);
}
