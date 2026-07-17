import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { quizzes as seedQuizzes } from "@/lib/data/quizzes";

export type DailyQuiz = {
  id: string;
  judul: string;
  topik: string | null;
  jumlahSoal: number;
};

/**
 * Nomor hari dalam zona WIB (UTC+7). Dipakai sebagai seed rotasi supaya
 * semua siswa mendapat kuis yang sama sepanjang hari, tanpa kerja guru.
 */
function epochDayWIB(now: Date = new Date()): number {
  return Math.floor((now.getTime() + 7 * 3_600_000) / 86_400_000);
}

/** Tanggal WIB (YYYY-MM-DD) dari sebuah timestamp — untuk hitung streak. */
function dateKeyWIB(iso: string): string {
  return new Date(new Date(iso).getTime() + 7 * 3_600_000)
    .toISOString()
    .slice(0, 10);
}

/**
 * Kuis hari ini — dipilih deterministik dari daftar kuis terbit, diurut
 * berdasarkan id agar stabil walau ada kuis baru yang created_at-nya beda.
 */
export async function getDailyQuiz(): Promise<DailyQuiz | null> {
  if (!isSupabaseConfigured) {
    const list = [...seedQuizzes].sort((a, b) => a.id.localeCompare(b.id));
    if (!list.length) return null;
    const q = list[epochDayWIB() % list.length];
    return {
      id: q.id,
      judul: q.judul,
      topik: q.topik,
      jumlahSoal: q.questions.length,
    };
  }

  const supabase = await createClient();
  const { data: qz } = await supabase
    .from("quizzes")
    .select("id, judul, topik")
    .eq("is_published", true)
    .order("id", { ascending: true });
  if (!qz || !qz.length) return null;

  const q = qz[epochDayWIB() % qz.length];

  const { count } = await supabase
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("quiz_id", q.id);

  return {
    id: q.id,
    judul: q.judul,
    topik: q.topik ?? null,
    jumlahSoal: count ?? 0,
  };
}

/**
 * Streak: jumlah hari berurutan siswa mengerjakan kuis mandiri.
 * Dihitung mundur dari hari ini; bila hari ini belum mengerjakan, streak
 * kemarin tetap dihitung (belum putus sampai hari berganti lagi).
 */
export async function getStreak(): Promise<number> {
  if (!isSupabaseConfigured) return 0;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { data } = await supabase
    .from("quiz_attempts")
    .select("created_at")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false })
    .limit(365);
  if (!data || !data.length) return 0;

  const days = new Set(data.map((r) => dateKeyWIB(r.created_at as string)));
  const dayKey = (offset: number) =>
    new Date((epochDayWIB() - offset) * 86_400_000).toISOString().slice(0, 10);

  // Mulai dari hari ini; bila kosong, coba kemarin agar streak tidak putus
  // hanya karena siswa belum sempat mengerjakan hari ini.
  let start = 0;
  if (!days.has(dayKey(0))) {
    if (!days.has(dayKey(1))) return 0;
    start = 1;
  }

  let streak = 0;
  for (let i = start; days.has(dayKey(i)); i++) streak++;
  return streak;
}
