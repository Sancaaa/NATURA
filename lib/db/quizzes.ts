import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { quizzes as seedQuizzes, type Question } from "@/lib/data/quizzes";
import type { DraftQuestion } from "@/lib/actions/quiz";

export type QuizForTaking = {
  id: string;
  judul: string;
  questions: Question[];
};

export type AssignableQuiz = {
  id: string;
  judul: string;
  topik: string | null;
};

export type MyQuiz = {
  id: string;
  judul: string;
  topik: string | null;
  sumber: string;
  jumlahSoal: number;
};

export type QuizForEdit = {
  id: string;
  judul: string;
  topik: string | null;
  questions: DraftQuestion[];
};

/** Kuis + soal untuk dikerjakan siswa (DB bila ada; jatuh ke seed bila tidak). */
export async function getQuizForTaking(
  id: string,
): Promise<QuizForTaking | null> {
  const seed = seedQuizzes.find((x) => x.id === id);

  if (!isSupabaseConfigured) {
    return seed ? { id: seed.id, judul: seed.judul, questions: seed.questions } : null;
  }

  const supabase = await createClient();
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, judul")
    .eq("id", id)
    .maybeSingle();

  if (!quiz) {
    return seed ? { id: seed.id, judul: seed.judul, questions: seed.questions } : null;
  }

  const { data: qs } = await supabase
    .from("questions")
    .select("id, pertanyaan, opsi, kunci, pembahasan, urutan")
    .eq("quiz_id", id)
    .order("urutan", { ascending: true });

  const questions: Question[] = (qs ?? []).map((r) => ({
    id: String(r.id),
    pertanyaan: r.pertanyaan,
    opsi: (r.opsi as string[]) ?? [],
    kunci: r.kunci,
    pembahasan: r.pembahasan ?? "",
  }));

  return { id: quiz.id, judul: quiz.judul, questions };
}

/** Daftar kuis yang bisa ditugaskan guru (bank contoh + kuis generatif). */
export async function getAssignableQuizzes(): Promise<AssignableQuiz[]> {
  if (!isSupabaseConfigured) {
    return seedQuizzes.map((q) => ({ id: q.id, judul: q.judul, topik: q.topik }));
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("quizzes")
    .select("id, judul, topik")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  return (data ?? []).map((q) => ({
    id: q.id,
    judul: q.judul,
    topik: q.topik ?? null,
  }));
}

/** Kuis milik guru yang sedang login (untuk halaman Bank Soal). */
export async function getMyQuizzes(): Promise<MyQuiz[]> {
  if (!isSupabaseConfigured) {
    return seedQuizzes.map((q) => ({
      id: q.id,
      judul: q.judul,
      topik: q.topik,
      sumber: q.sumber,
      jumlahSoal: q.questions.length,
    }));
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: qz } = await supabase
    .from("quizzes")
    .select("id, judul, topik, sumber")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });
  if (!qz || !qz.length) return [];

  const ids = qz.map((q) => q.id);
  const counts: Record<string, number> = {};
  const { data: qs } = await supabase
    .from("questions")
    .select("quiz_id")
    .in("quiz_id", ids);
  (qs ?? []).forEach((r) => {
    counts[r.quiz_id] = (counts[r.quiz_id] ?? 0) + 1;
  });

  return qz.map((q) => ({
    id: q.id,
    judul: q.judul,
    topik: q.topik ?? null,
    sumber: q.sumber,
    jumlahSoal: counts[q.id] ?? 0,
  }));
}

/** Kuis + soal dalam bentuk draf (untuk diedit). */
export async function getQuizForEdit(id: string): Promise<QuizForEdit | null> {
  const toDraft = (qs: Question[]): DraftQuestion[] =>
    qs.map((x) => ({
      pertanyaan: x.pertanyaan,
      opsi: x.opsi,
      kunci: x.kunci,
      pembahasan: x.pembahasan,
    }));
  const seed = seedQuizzes.find((x) => x.id === id);

  if (!isSupabaseConfigured) {
    return seed
      ? { id: seed.id, judul: seed.judul, topik: seed.topik, questions: toDraft(seed.questions) }
      : null;
  }

  const supabase = await createClient();
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, judul, topik")
    .eq("id", id)
    .maybeSingle();
  if (!quiz) {
    return seed
      ? { id: seed.id, judul: seed.judul, topik: seed.topik, questions: toDraft(seed.questions) }
      : null;
  }

  const { data: qs } = await supabase
    .from("questions")
    .select("pertanyaan, opsi, kunci, pembahasan, urutan")
    .eq("quiz_id", id)
    .order("urutan", { ascending: true });

  const questions: DraftQuestion[] = (qs ?? []).map((r) => ({
    pertanyaan: r.pertanyaan,
    opsi: (r.opsi as string[]) ?? [],
    kunci: r.kunci,
    pembahasan: r.pembahasan ?? "",
  }));

  return { id: quiz.id, judul: quiz.judul, topik: quiz.topik ?? null, questions };
}
