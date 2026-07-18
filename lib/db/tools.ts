import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { tools as seedTools, type LabTool } from "@/lib/data/tools";

export type { LabTool };

const BASE_COLS =
  "id, nama, fungsi, cara_pakai, keselamatan, model_3d_url, ar_target_url, ar_intro";
const COLS = `${BASE_COLS}, gambar_url`;

/* eslint-disable @typescript-eslint/no-explicit-any */
function toTool(r: any): LabTool {
  return {
    id: r.id,
    nama: r.nama ?? "",
    fungsi: r.fungsi ?? "",
    caraPakai: r.cara_pakai ?? "",
    keselamatan: r.keselamatan ?? "",
    model3dUrl: r.model_3d_url ?? undefined,
    arTargetUrl: r.ar_target_url ?? undefined,
    arIntro: r.ar_intro ?? undefined,
    gambarUrl: r.gambar_url ?? undefined,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Daftar alat lab (DB bila tersedia; jatuh ke data contoh bila tidak). */
export async function getTools(): Promise<LabTool[]> {
  if (!isSupabaseConfigured) return seedTools;
  const supabase = await createClient();
  // Coba dengan gambar_url; bila kolom belum ada, ulang tanpa kolom itu.
  const res = await supabase
    .from("lab_tools")
    .select(COLS)
    .order("nama", { ascending: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rows: any[] | null = res.data;
  if (res.error) {
    rows = (
      await supabase
        .from("lab_tools")
        .select(BASE_COLS)
        .order("nama", { ascending: true })
    ).data;
  }
  return (rows ?? []).map(toTool);
}

/** Satu alat berdasarkan id (DB dulu, lalu data contoh). */
export async function getToolDb(id: string): Promise<LabTool | null> {
  if (!isSupabaseConfigured) return seedTools.find((t) => t.id === id) ?? null;
  const supabase = await createClient();
  const res = await supabase
    .from("lab_tools")
    .select(COLS)
    .eq("id", id)
    .maybeSingle();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let row: any = res.data;
  if (res.error) {
    row = (
      await supabase
        .from("lab_tools")
        .select(BASE_COLS)
        .eq("id", id)
        .maybeSingle()
    ).data;
  }
  if (!row) return seedTools.find((t) => t.id === id) ?? null;
  return toTool(row);
}
