"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type ActionState = { error?: string; ok?: string };

const DEMO: ActionState = {
  error: "Aktifkan Supabase (isi .env.local) untuk menyimpan data.",
};

function genCode() {
  return "NAT-" + Math.floor(1000 + Math.random() * 9000);
}

export async function createClass(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured) return DEMO;
  const nama = String(formData.get("nama") ?? "").trim();
  const tahun = String(formData.get("tahun_ajaran") ?? "").trim();
  if (!nama) return { error: "Nama kelas wajib diisi." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi berakhir, silakan masuk lagi." };

  const { error } = await supabase.from("classes").insert({
    teacher_id: user.id,
    nama,
    tahun_ajaran: tahun || null,
    join_code: genCode(),
  });
  if (error) return { error: error.message };

  revalidatePath("/kelas");
  revalidatePath("/dashboard");
  return { ok: "Kelas dibuat." };
}

export async function joinClass(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured) return DEMO;
  const code = String(formData.get("code") ?? "")
    .trim()
    .toUpperCase();
  if (!code) return { error: "Masukkan kode kelas." };

  const supabase = await createClient();
  const { data: cid, error } = await supabase.rpc("join_class_by_code", {
    p_code: code,
  });
  if (error) return { error: error.message };
  if (!cid) return { error: "Kode kelas tidak ditemukan." };

  revalidatePath("/kuis");
  revalidatePath("/beranda");
  return { ok: "Berhasil gabung kelas!" };
}

export async function createAssignment(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured) return DEMO;
  const classId = String(formData.get("class_id") ?? "");
  const quizId = String(formData.get("quiz_id") ?? "");
  const deadline = String(formData.get("deadline") ?? "").trim();
  if (!classId || !quizId) return { error: "Pilih kuis terlebih dahulu." };

  const supabase = await createClient();
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("judul")
    .eq("id", quizId)
    .maybeSingle();
  const judul = quiz?.judul ?? "Tugas";

  const { error } = await supabase.from("assignments").insert({
    class_id: classId,
    quiz_id: quizId,
    judul,
    deadline: deadline || null,
  });
  if (error) return { error: error.message };

  revalidatePath(`/kelas/${classId}`);
  revalidatePath("/dashboard");
  return { ok: "Tugas ditugaskan." };
}

export async function deleteAssignment(
  assignmentId: string,
  classId: string,
): Promise<{ ok?: boolean; error?: string }> {
  if (!isSupabaseConfigured)
    return { error: "Aktifkan Supabase untuk mengelola tugas." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi berakhir." };

  // RLS (teaches_class) memastikan hanya guru pemilik kelas yang bisa hapus.
  const { error } = await supabase
    .from("assignments")
    .delete()
    .eq("id", assignmentId);
  if (error) return { error: error.message };

  revalidatePath(`/kelas/${classId}`);
  revalidatePath("/dashboard");
  revalidatePath("/kuis");
  return { ok: true };
}

/** Dipanggil dari halaman kuis (client) saat siswa mengumpulkan jawaban. */
export async function saveQuizResult(input: {
  quizId: string;
  assignmentId?: string;
  score: number;
  detail: unknown;
}): Promise<{ saved: boolean }> {
  if (!isSupabaseConfigured) return { saved: false };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { saved: false };

  if (input.assignmentId) {
    const { error } = await supabase.from("submissions").upsert(
      {
        assignment_id: input.assignmentId,
        student_id: user.id,
        jawaban: input.detail as never,
        skor: input.score,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      },
      { onConflict: "assignment_id,student_id" },
    );
    if (error) return { saved: false };
    revalidatePath("/kuis");
    revalidatePath("/dashboard");
    return { saved: true };
  }

  const { error } = await supabase.from("quiz_attempts").insert({
    quiz_id: input.quizId,
    student_id: user.id,
    skor: input.score,
    detail: input.detail as never,
  });
  return { saved: !error };
}
