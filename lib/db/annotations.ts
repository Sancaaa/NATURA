import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  getSeedAnnotations,
  type Annotation,
} from "@/lib/data/annotations";

export type { Annotation };

export type SubjectType = "plant" | "tool";

/* eslint-disable @typescript-eslint/no-explicit-any */
function toAnnotation(r: any): Annotation {
  return {
    partKey: r.part_key ?? "",
    label: r.label ?? "",
    pos: [r.pos_x ?? 0, r.pos_y ?? 0, r.pos_z ?? 0],
    labelPos: [r.label_x ?? 0, r.label_y ?? 0, r.label_z ?? 0],
    body: (r.body as string[]) ?? [],
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Titik highlight untuk sebuah tanaman/alat. DB bila tersedia; bila DB kosong
 * atau mode demo, pakai anotasi contoh (fallback).
 */
export async function getAnnotations(
  type: SubjectType,
  id: string,
): Promise<Annotation[]> {
  if (!isSupabaseConfigured) return getSeedAnnotations(type, id);

  const supabase = await createClient();
  const { data } = await supabase
    .from("content_annotations")
    .select(
      "part_key, label, pos_x, pos_y, pos_z, label_x, label_y, label_z, body, urutan",
    )
    .eq("subject_type", type)
    .eq("subject_id", id)
    .order("urutan", { ascending: true });

  if (!data || data.length === 0) return getSeedAnnotations(type, id);
  return data.map(toAnnotation);
}
