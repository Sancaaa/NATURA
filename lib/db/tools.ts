import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { tools as seedTools, type LabTool } from "@/lib/data/tools";

export type { LabTool };

const COLS =
  "id, nama, fungsi, cara_pakai, keselamatan, model_3d_url, ar_target_url, ar_intro";

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
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Daftar alat lab (DB bila tersedia; jatuh ke data contoh bila tidak). */
export async function getTools(): Promise<LabTool[]> {
  if (!isSupabaseConfigured) return seedTools;
  const supabase = await createClient();
  const { data } = await supabase
    .from("lab_tools")
    .select(COLS)
    .order("nama", { ascending: true });
  return (data ?? []).map(toTool);
}

/** Satu alat berdasarkan id (DB dulu, lalu data contoh). */
export async function getToolDb(id: string): Promise<LabTool | null> {
  if (!isSupabaseConfigured) return seedTools.find((t) => t.id === id) ?? null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("lab_tools")
    .select(COLS)
    .eq("id", id)
    .maybeSingle();
  if (!data) return seedTools.find((t) => t.id === id) ?? null;
  return toTool(data);
}
