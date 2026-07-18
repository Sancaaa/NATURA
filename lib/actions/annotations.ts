"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type SubjectType = "plant" | "tool";

export type AnnotationInput = {
  label: string;
  body: string[];
  /** Titik pada model (koordinat frame .content, sudah termasuk offset model). */
  pos: [number, number, number];
  /** Offset label relatif terhadap titik. */
  labelPos: [number, number, number];
};

function slug(s: string): string {
  return (
    (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "titik"
  );
}

/** part_key unik & aman untuk tiap anotasi (dipakai raycast label di viewer). */
function derivePartKeys(items: AnnotationInput[]): string[] {
  const used = new Set<string>();
  return items.map((it) => {
    let key = slug(it.label);
    let n = 2;
    while (used.has(key)) key = `${slug(it.label)}-${n++}`;
    used.add(key);
    return key;
  });
}

async function requireAdmin(): Promise<{ id: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi berakhir." };
  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!me || me.role !== "admin") return { error: "Hanya admin." };
  return { id: user.id };
}

function num(v: unknown): number {
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}

/**
 * Simpan seluruh titik highlight untuk sebuah tanaman/alat (ganti total).
 * Pola ganti-semua (hapus lalu sisip) - sama seperti updateQuiz.
 */
export async function saveAnnotations(
  subjectType: SubjectType,
  subjectId: string,
  items: AnnotationInput[],
): Promise<{ ok?: boolean; error?: string }> {
  if (!isSupabaseConfigured)
    return { error: "Aktifkan Supabase untuk menyimpan." };
  if (subjectType !== "plant" && subjectType !== "tool")
    return { error: "Tipe tidak valid." };
  if (!subjectId) return { error: "ID konten kosong." };

  const list = Array.isArray(items) ? items : [];
  const bad = list.findIndex((it) => !it.label?.trim());
  if (bad >= 0) return { error: `Titik ${bad + 1} belum punya label.` };

  const admin = await requireAdmin();
  if ("error" in admin) return { error: admin.error };

  const supabase = await createClient();

  const { error: de } = await supabase
    .from("content_annotations")
    .delete()
    .eq("subject_type", subjectType)
    .eq("subject_id", subjectId);
  if (de) return { error: de.message };

  if (list.length) {
    const keys = derivePartKeys(list);
    const rows = list.map((it, i) => ({
      subject_type: subjectType,
      subject_id: subjectId,
      urutan: i + 1,
      part_key: keys[i],
      label: it.label.trim(),
      pos_x: num(it.pos?.[0]),
      pos_y: num(it.pos?.[1]),
      pos_z: num(it.pos?.[2]),
      label_x: num(it.labelPos?.[0]),
      label_y: num(it.labelPos?.[1]),
      label_z: num(it.labelPos?.[2]),
      body: (it.body ?? []).map((b) => b.trim()).filter(Boolean),
    }));
    const { error: ie } = await supabase
      .from("content_annotations")
      .insert(rows);
    if (ie) return { error: ie.message };
  }

  const base = subjectType === "plant" ? "/admin/tanaman" : "/admin/alat";
  revalidatePath(`${base}/${subjectId}/titik`);
  return { ok: true };
}
