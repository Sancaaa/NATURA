"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type DraftQuestion = {
  pertanyaan: string;
  opsi: string[];
  kunci: number;
  pembahasan: string;
};

function validDraft(q: unknown): q is DraftQuestion {
  const x = q as DraftQuestion;
  return (
    !!x &&
    typeof x.pertanyaan === "string" &&
    x.pertanyaan.trim().length > 0 &&
    Array.isArray(x.opsi) &&
    x.opsi.length >= 2 &&
    x.opsi.every((o) => typeof o === "string" && o.trim().length > 0) &&
    Number.isInteger(x.kunci) &&
    x.kunci >= 0 &&
    x.kunci < x.opsi.length &&
    typeof x.pembahasan === "string"
  );
}

/** Index soal pertama yang belum lengkap, atau -1 bila semua valid. */
function firstInvalid(questions: DraftQuestion[]): number {
  return questions.findIndex((q) => !validDraft(q));
}

async function requireTeacher(): Promise<
  { userId: string; isAdmin: boolean } | { error: string }
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
  if (!me || !["teacher", "admin"].includes(me.role))
    return { error: "Hanya guru/admin." };
  return { userId: user.id, isAdmin: me.role === "admin" };
}

/** Hasilkan draf soal dengan Gemini (belum disimpan — untuk ditinjau guru). */
export async function generateQuiz(
  topik: string,
  jumlah: number,
): Promise<{ questions?: DraftQuestion[]; error?: string }> {
  const key = process.env.GEMINI_API_KEY;
  if (!key)
    return {
      error: "Fitur pembuatan soal otomatis belum tersedia. Hubungi administrator.",
    };

  const n = Math.max(1, Math.min(10, Math.floor(jumlah) || 3));
  const t = (topik || "").trim() || "Farmakognosi dasar";
  const prompt =
    `Buatkan ${n} soal pilihan ganda mata pelajaran Farmakognosi untuk siswa SMK ` +
    `Farmasi tentang topik "${t}". Gunakan Bahasa Indonesia yang jelas dan akurat. ` +
    `Setiap soal punya tepat 4 opsi, satu jawaban benar, dan pembahasan singkat.\n` +
    `Keluarkan HANYA JSON valid (tanpa teks/markdown lain) dengan bentuk persis:\n` +
    `{"questions":[{"pertanyaan":"...","opsi":["a","b","c","d"],"kunci":0,"pembahasan":"..."}]}\n` +
    `"kunci" adalah indeks (mulai 0) dari opsi yang benar.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 2048,
            responseMimeType: "application/json",
          },
        }),
      },
    );
    if (!res.ok) return { error: "Gagal membuat soal. Silakan coba lagi beberapa saat lagi." };
    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts as
      | { text?: string }[]
      | undefined;
    const text = parts?.map((p) => p.text ?? "").join("") ?? "";

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return { error: "Gagal memproses soal yang dibuat. Silakan coba lagi." };
    }
    const holder = parsed as { questions?: unknown[] };
    const raw = Array.isArray(holder?.questions)
      ? holder.questions
      : Array.isArray(parsed)
        ? (parsed as unknown[])
        : [];
    const questions = raw.filter(validDraft).slice(0, n);
    if (!questions.length)
      return { error: "Tidak ada soal yang dihasilkan. Coba topik lain." };
    return { questions };
  } catch {
    return { error: "Terjadi kesalahan saat membuat soal. Periksa koneksi internet Anda." };
  }
}

/** Simpan draf sebagai kuis baru milik guru → siap ditugaskan. */
export async function publishQuiz(
  judul: string,
  topik: string,
  questions: DraftQuestion[],
): Promise<{ ok?: boolean; error?: string; quizId?: string }> {
  if (!isSupabaseConfigured)
    return { error: "Aktifkan Supabase untuk menyimpan kuis." };
  if (!questions?.length) return { error: "Minimal satu soal." };
  const bad = firstInvalid(questions);
  if (bad >= 0)
    return { error: `Soal ${bad + 1} belum lengkap (pertanyaan/opsi/jawaban).` };

  const who = await requireTeacher();
  if ("error" in who) return { error: who.error };

  const supabase = await createClient();
  const quizId = "gen-" + crypto.randomUUID();
  const { error: qe } = await supabase.from("quizzes").insert({
    id: quizId,
    judul: (judul || "").trim() || `Kuis: ${topik || "Farmakognosi"}`,
    topik: (topik || "").trim() || null,
    sumber: "generated",
    created_by: who.userId,
    is_published: true,
  });
  if (qe) return { error: qe.message };

  const { error: qqe } = await supabase.from("questions").insert(
    questions.map((q, i) => ({
      quiz_id: quizId,
      urutan: i + 1,
      pertanyaan: q.pertanyaan,
      opsi: q.opsi,
      kunci: q.kunci,
      pembahasan: q.pembahasan,
    })),
  );
  if (qqe) return { error: qqe.message };

  revalidatePath("/bank-soal");
  revalidatePath("/kelas");
  return { ok: true, quizId };
}

/** Perbarui kuis (judul/topik + ganti seluruh soal). */
export async function updateQuiz(
  quizId: string,
  judul: string,
  topik: string,
  questions: DraftQuestion[],
): Promise<{ ok?: boolean; error?: string }> {
  if (!isSupabaseConfigured)
    return { error: "Aktifkan Supabase untuk menyimpan." };
  if (!questions?.length) return { error: "Minimal satu soal." };
  const bad = firstInvalid(questions);
  if (bad >= 0)
    return { error: `Soal ${bad + 1} belum lengkap (pertanyaan/opsi/jawaban).` };

  const who = await requireTeacher();
  if ("error" in who) return { error: who.error };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("quizzes")
    .select("created_by")
    .eq("id", quizId)
    .maybeSingle();
  if (!existing) return { error: "Kuis tidak ditemukan." };
  if (!who.isAdmin && existing.created_by !== who.userId)
    return { error: "Bukan kuis milik Anda." };

  const { error: ue } = await supabase
    .from("quizzes")
    .update({
      judul: (judul || "").trim() || "Kuis",
      topik: (topik || "").trim() || null,
    })
    .eq("id", quizId);
  if (ue) return { error: ue.message };

  const { error: de } = await supabase
    .from("questions")
    .delete()
    .eq("quiz_id", quizId);
  if (de) return { error: de.message };

  const { error: ie } = await supabase.from("questions").insert(
    questions.map((q, i) => ({
      quiz_id: quizId,
      urutan: i + 1,
      pertanyaan: q.pertanyaan,
      opsi: q.opsi,
      kunci: q.kunci,
      pembahasan: q.pembahasan,
    })),
  );
  if (ie) return { error: ie.message };

  revalidatePath("/bank-soal");
  return { ok: true };
}

/** Hapus kuis milik guru (soal ikut terhapus; ditolak bila sedang ditugaskan). */
export async function deleteQuiz(
  quizId: string,
): Promise<{ ok?: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { error: "Perubahan tidak dapat disimpan saat ini." };
  const who = await requireTeacher();
  if ("error" in who) return { error: who.error };

  const supabase = await createClient();
  const { error } = await supabase.from("quizzes").delete().eq("id", quizId);
  if (error) {
    if (error.code === "23503")
      return {
        error: "Kuis sedang ditugaskan ke kelas — hapus tugasnya dulu.",
      };
    return { error: error.message };
  }
  revalidatePath("/bank-soal");
  revalidatePath("/kelas");
  return { ok: true };
}
