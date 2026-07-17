"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { parseAttachments, type Attachment } from "@/lib/attachments";

export type ActionResult = { ok?: boolean; error?: string; id?: string };

export type PlantInput = {
  namaLokal: string;
  namaLatin: string;
  familia: string;
  bagianDigunakan: string;
  namaSimplisia: string;
  kandungan: string[];
  khasiat: string;
  makroskopik: string;
  mikroskopik: string;
  model3dUrl?: string;
  arTargetUrl?: string;
  arIntro?: string;
};

export type ToolInput = {
  nama: string;
  fungsi: string;
  caraPakai: string;
  keselamatan: string;
  model3dUrl?: string;
  arTargetUrl?: string;
  arIntro?: string;
};

export type LibraryInput = {
  judul: string;
  tipe: "Modul" | "Artikel" | "Buku";
  penulis: string;
  ringkasan: string;
  konten: string[];
  offline: boolean;
  lampiran: Attachment[];
};

/** Ubah teks bebas menjadi slug id yang aman & stabil. */
function slugify(s: string): string {
  return (
    (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "item"
  );
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

/**
 * Modul materi boleh dikelola guru maupun admin. Batas kepemilikan
 * (guru hanya boleh mengubah modulnya sendiri) ditegakkan RLS
 * `library_write` — di sini kita hanya menyaring peran.
 */
async function requireTeacherOrAdmin(): Promise<
  { id: string; role: string } | { error: string }
> {
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
  if (!me || (me.role !== "admin" && me.role !== "teacher"))
    return { error: "Hanya guru atau admin." };
  return { id: user.id, role: me.role };
}

/** Jamin id unik pada tabel: tambahkan sufiks -2, -3, … bila bentrok. */
async function uniqueId(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  table: string,
  base: string,
): Promise<string> {
  let id = base;
  for (let n = 2; n < 100; n++) {
    const { data } = await supabase
      .from(table)
      .select("id")
      .eq("id", id)
      .maybeSingle();
    if (!data) return id;
    id = `${base}-${n}`;
  }
  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

function revalidateContent() {
  revalidatePath("/natulab/tanaman");
  revalidatePath("/natulab/alat");
  revalidatePath("/natulab/ar");
  revalidatePath("/natulearn/modul");
  revalidatePath("/beranda");
}

// ── Tanaman ────────────────────────────────────────────────────
function validPlant(i: PlantInput): string | null {
  if (!i.namaLokal?.trim()) return "Nama lokal wajib diisi.";
  if (!i.namaLatin?.trim()) return "Nama latin wajib diisi.";
  return null;
}

function plantRow(i: PlantInput) {
  const clean = (s?: string) => (s?.trim() ? s.trim() : null);
  return {
    nama_lokal: i.namaLokal.trim(),
    nama_latin: i.namaLatin.trim(),
    familia: clean(i.familia),
    bagian_digunakan: clean(i.bagianDigunakan),
    nama_simplisia: clean(i.namaSimplisia),
    kandungan: (i.kandungan ?? []).map((k) => k.trim()).filter(Boolean),
    khasiat: clean(i.khasiat),
    makroskopik: clean(i.makroskopik),
    mikroskopik: clean(i.mikroskopik),
    model_3d_url: clean(i.model3dUrl),
    ar_target_url: clean(i.arTargetUrl),
    ar_intro: clean(i.arIntro),
  };
}

export async function createPlant(input: PlantInput): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { error: "Aktifkan Supabase untuk menyimpan." };
  const bad = validPlant(input);
  if (bad) return { error: bad };
  const admin = await requireAdmin();
  if ("error" in admin) return { error: admin.error };

  const supabase = await createClient();
  const id = await uniqueId(supabase, "plants", slugify(input.namaLokal));
  const { error } = await supabase
    .from("plants")
    .insert({ id, ...plantRow(input) });
  if (error) return { error: error.message };
  revalidateContent();
  revalidatePath("/admin/tanaman");
  return { ok: true, id };
}

export async function updatePlant(
  id: string,
  input: PlantInput,
): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { error: "Aktifkan Supabase untuk menyimpan." };
  const bad = validPlant(input);
  if (bad) return { error: bad };
  const admin = await requireAdmin();
  if ("error" in admin) return { error: admin.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("plants")
    .update(plantRow(input))
    .eq("id", id);
  if (error) return { error: error.message };
  revalidateContent();
  revalidatePath("/admin/tanaman");
  revalidatePath(`/natulab/tanaman/${id}`);
  return { ok: true, id };
}

export async function deletePlant(id: string): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { error: "Mode demo — tidak disimpan." };
  const admin = await requireAdmin();
  if ("error" in admin) return { error: admin.error };
  const supabase = await createClient();
  const { error } = await supabase.from("plants").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateContent();
  revalidatePath("/admin/tanaman");
  return { ok: true };
}

// ── Alat lab ───────────────────────────────────────────────────
function toolRow(i: ToolInput) {
  const clean = (s?: string) => (s?.trim() ? s.trim() : null);
  return {
    nama: i.nama.trim(),
    fungsi: clean(i.fungsi),
    cara_pakai: clean(i.caraPakai),
    keselamatan: clean(i.keselamatan),
    model_3d_url: clean(i.model3dUrl),
    ar_target_url: clean(i.arTargetUrl),
    ar_intro: clean(i.arIntro),
  };
}

export async function createTool(input: ToolInput): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { error: "Aktifkan Supabase untuk menyimpan." };
  if (!input.nama?.trim()) return { error: "Nama alat wajib diisi." };
  const admin = await requireAdmin();
  if ("error" in admin) return { error: admin.error };

  const supabase = await createClient();
  const id = await uniqueId(supabase, "lab_tools", slugify(input.nama));
  const { error } = await supabase
    .from("lab_tools")
    .insert({ id, ...toolRow(input) });
  if (error) return { error: error.message };
  revalidateContent();
  revalidatePath("/admin/alat");
  return { ok: true, id };
}

export async function updateTool(
  id: string,
  input: ToolInput,
): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { error: "Aktifkan Supabase untuk menyimpan." };
  if (!input.nama?.trim()) return { error: "Nama alat wajib diisi." };
  const admin = await requireAdmin();
  if ("error" in admin) return { error: admin.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("lab_tools")
    .update(toolRow(input))
    .eq("id", id);
  if (error) return { error: error.message };
  revalidateContent();
  revalidatePath("/admin/alat");
  revalidatePath(`/natulab/alat/${id}`);
  return { ok: true, id };
}

export async function deleteTool(id: string): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { error: "Mode demo — tidak disimpan." };
  const admin = await requireAdmin();
  if ("error" in admin) return { error: admin.error };
  const supabase = await createClient();
  const { error } = await supabase.from("lab_tools").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateContent();
  revalidatePath("/admin/alat");
  return { ok: true };
}

// ── Pustaka ────────────────────────────────────────────────────
function validLibrary(i: LibraryInput): string | null {
  if (!i.judul?.trim()) return "Judul wajib diisi.";
  if (!["Modul", "Artikel", "Buku"].includes(i.tipe))
    return "Tipe tidak valid.";
  return null;
}

function libraryRow(i: LibraryInput) {
  const clean = (s?: string) => (s?.trim() ? s.trim() : null);
  return {
    judul: i.judul.trim(),
    tipe: i.tipe,
    penulis: clean(i.penulis),
    ringkasan: clean(i.ringkasan),
    konten: (i.konten ?? []).map((p) => p.trim()).filter(Boolean),
    offline: !!i.offline,
    lampiran: parseAttachments(i.lampiran),
  };
}

export async function createLibraryItem(
  input: LibraryInput,
): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { error: "Aktifkan Supabase untuk menyimpan." };
  const bad = validLibrary(input);
  if (bad) return { error: bad };
  const me = await requireTeacherOrAdmin();
  if ("error" in me) return { error: me.error };

  const supabase = await createClient();
  const id = await uniqueId(supabase, "library_items", slugify(input.judul));
  // created_by wajib diisi: policy library_write mensyaratkan pemilik = auth.uid()
  // (atau admin), jadi insert tanpa ini akan ditolak RLS untuk guru.
  const { error } = await supabase
    .from("library_items")
    .insert({ id, ...libraryRow(input), created_by: me.id });
  if (error) return { error: error.message };
  revalidateContent();
  revalidatePath("/admin/pustaka");
  revalidatePath("/modul");
  return { ok: true, id };
}

export async function updateLibraryItem(
  id: string,
  input: LibraryInput,
): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { error: "Aktifkan Supabase untuk menyimpan." };
  const bad = validLibrary(input);
  if (bad) return { error: bad };
  const me = await requireTeacherOrAdmin();
  if ("error" in me) return { error: me.error };

  const supabase = await createClient();
  // RLS menolak diam-diam bila guru mengubah modul milik orang lain
  // (0 baris terpengaruh, tanpa error) → minta baris balik untuk mendeteksinya.
  const { data, error } = await supabase
    .from("library_items")
    .update(libraryRow(input))
    .eq("id", id)
    .select("id");
  if (error) return { error: error.message };
  if (!data || !data.length)
    return { error: "Kamu hanya bisa mengubah modul yang kamu buat sendiri." };
  revalidateContent();
  revalidatePath("/admin/pustaka");
  revalidatePath("/modul");
  revalidatePath(`/natulearn/modul/${id}`);
  return { ok: true, id };
}

export async function deleteLibraryItem(id: string): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { error: "Mode demo — tidak disimpan." };
  const me = await requireTeacherOrAdmin();
  if ("error" in me) return { error: me.error };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("library_items")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) return { error: error.message };
  if (!data || !data.length)
    return { error: "Kamu hanya bisa menghapus modul yang kamu buat sendiri." };
  revalidateContent();
  revalidatePath("/admin/pustaka");
  revalidatePath("/modul");
  return { ok: true };
}
