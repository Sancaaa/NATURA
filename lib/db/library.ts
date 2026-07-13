import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { library as seedLibrary, type LibraryItem } from "@/lib/data/library";

export type { LibraryItem };

const COLS = "id, judul, tipe, penulis, ringkasan, konten, offline";

/* eslint-disable @typescript-eslint/no-explicit-any */
function toItem(r: any): LibraryItem {
  return {
    id: r.id,
    judul: r.judul ?? "",
    tipe: (r.tipe as LibraryItem["tipe"]) ?? "Modul",
    penulis: r.penulis ?? "",
    ringkasan: r.ringkasan ?? "",
    konten: (r.konten as string[]) ?? [],
    offline: !!r.offline,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Daftar pustaka (DB bila tersedia; jatuh ke data contoh bila tidak). */
export async function getLibrary(): Promise<LibraryItem[]> {
  if (!isSupabaseConfigured) return seedLibrary;
  const supabase = await createClient();
  const { data } = await supabase
    .from("library_items")
    .select(COLS)
    .order("judul", { ascending: true });
  return (data ?? []).map(toItem);
}

/** Satu item pustaka berdasarkan id (DB dulu, lalu data contoh). */
export async function getLibraryItemDb(
  id: string,
): Promise<LibraryItem | null> {
  if (!isSupabaseConfigured)
    return seedLibrary.find((i) => i.id === id) ?? null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("library_items")
    .select(COLS)
    .eq("id", id)
    .maybeSingle();
  if (!data) return seedLibrary.find((i) => i.id === id) ?? null;
  return toItem(data);
}
