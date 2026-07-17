import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  classes as seedClasses,
  findStudent as seedFindStudent,
} from "@/lib/data/classroom";
import { quizzes as seedQuizzes } from "@/lib/data/quizzes";
import { parseAttachments, type Attachment } from "@/lib/attachments";

const quizTopik = (quizId: string) =>
  seedQuizzes.find((q) => q.id === quizId)?.topik ?? "";

/**
 * Peta quizId → topik dari DB, dengan seed sebagai cadangan.
 * Perlu karena kuis buatan guru hanya ada di tabel `quizzes`; membaca topik
 * dari seed saja membuat topiknya selalu kosong.
 */
async function fetchQuizTopics(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  quizIds: string[],
): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  const ids = Array.from(new Set(quizIds)).filter(Boolean);
  if (!ids.length) return out;

  const { data } = await supabase
    .from("quizzes")
    .select("id, topik")
    .in("id", ids);
  (data ?? []).forEach((q: { id: string; topik: string | null }) => {
    if (q.topik) out[q.id] = q.topik;
  });
  // Kuis contoh tidak ada di DB → jatuh ke seed.
  for (const id of ids) if (!out[id]) out[id] = quizTopik(id);
  return out;
}

/** Status tugas dari sudut pandang siswa. Diturunkan, tidak disimpan. */
export type TugasStatus = "belum" | "selesai" | "terlambat";

/** `deadline` bisa berupa string demo ("3 hari lagi") → jangan anggap lewat. */
function deriveStatus(
  sudahDikerjakan: boolean,
  deadline: string | null,
): TugasStatus {
  if (sudahDikerjakan) return "selesai";
  if (deadline) {
    const d = new Date(deadline);
    if (!Number.isNaN(d.getTime()) && d.getTime() < Date.now())
      return "terlambat";
  }
  return "belum";
}

export type ClassSummary = {
  id: string;
  nama: string;
  tahunAjaran: string | null;
  joinCode: string;
  jumlahSiswa: number;
};

export type EnrolledStudent = {
  id: string;
  nama: string;
  skorRataRata: number | null;
  jumlahSelesai: number;
};

export type AssignmentRow = {
  id: string;
  judul: string;
  quizId: string;
  topik: string;
  bobot: number;
  deadline: string | null;
  jumlahSubmit: number;
  totalSiswa: number;
};

export type ClassDetail = {
  id: string;
  nama: string;
  tahunAjaran: string | null;
  joinCode: string;
  students: EnrolledStudent[];
  assignments: AssignmentRow[];
};

export type StudentAssignment = {
  assignmentId: string;
  quizId: string;
  judul: string;
  topik: string;
  deskripsi: string;
  bobot: number;
  lampiran: Attachment[];
  deadline: string | null;
  status: TugasStatus;
  sudahDikerjakan: boolean;
  skor: number | null;
  kelas: string;
};

/** Satu tugas milik guru, lintas kelas (halaman /tugas). */
export type TeacherAssignment = {
  id: string;
  judul: string;
  quizId: string;
  topik: string;
  bobot: number;
  deadline: string | null;
  classId: string;
  kelas: string;
  jumlahSubmit: number;
  totalSiswa: number;
  lampiran: Attachment[];
};

/** Satu siswa yang diampu guru, lintas kelas (halaman /siswa). */
export type TeacherStudent = {
  id: string;
  nama: string;
  kelas: string[];
  skorRataRata: number | null;
  jumlahSelesai: number;
};

export type TeacherDashboard = {
  totalSiswa: number;
  rataSkor: number;
  jumlahKelas: number;
  jumlahTugas: number;
  perhatian: { id: string; nama: string; skor: number | null }[];
};

export type StudentDetail = {
  nama: string;
  kelasNama: string | null;
  demo: boolean;
  submissions: {
    judul: string;
    skor: number | null;
    submittedAt: string | null;
  }[];
};

// ── Guru ───────────────────────────────────────────────────────

export async function getTeacherClasses(): Promise<ClassSummary[]> {
  if (!isSupabaseConfigured) {
    return seedClasses.map((c) => ({
      id: c.id,
      nama: c.nama,
      tahunAjaran: c.tahunAjaran,
      joinCode: c.kodeGabung,
      jumlahSiswa: c.students.length,
    }));
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: cls } = await supabase
    .from("classes")
    .select("id, nama, tahun_ajaran, join_code")
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false });
  if (!cls) return [];

  const ids = cls.map((c) => c.id);
  const counts: Record<string, number> = {};
  if (ids.length) {
    const { data: en } = await supabase
      .from("enrollments")
      .select("class_id")
      .in("class_id", ids);
    (en ?? []).forEach((e) => {
      counts[e.class_id] = (counts[e.class_id] ?? 0) + 1;
    });
  }

  return cls.map((c) => ({
    id: c.id,
    nama: c.nama,
    tahunAjaran: c.tahun_ajaran,
    joinCode: c.join_code,
    jumlahSiswa: counts[c.id] ?? 0,
  }));
}

export async function getClassDetail(
  id: string,
): Promise<ClassDetail | null> {
  if (!isSupabaseConfigured) {
    const c = seedClasses.find((x) => x.id === id);
    if (!c) return null;
    return {
      id: c.id,
      nama: c.nama,
      tahunAjaran: c.tahunAjaran,
      joinCode: c.kodeGabung,
      students: c.students.map((s) => ({
        id: s.id,
        nama: s.nama,
        skorRataRata: s.skorTerakhir,
        jumlahSelesai: 1,
      })),
      assignments: [],
    };
  }

  const supabase = await createClient();
  const { data: c } = await supabase
    .from("classes")
    .select("id, nama, tahun_ajaran, join_code")
    .eq("id", id)
    .maybeSingle();
  if (!c) return null;

  const { data: en } = await supabase
    .from("enrollments")
    .select("student_id")
    .eq("class_id", id);
  const studentIds = (en ?? []).map((e) => e.student_id);

  let profiles: { id: string; nama: string }[] = [];
  if (studentIds.length) {
    const { data: pr } = await supabase
      .from("profiles")
      .select("id, nama")
      .in("id", studentIds);
    profiles = pr ?? [];
  }

  const { data: asg } = await supabase
    .from("assignments")
    .select("id, judul, quiz_id, bobot, deadline")
    .eq("class_id", id)
    .order("created_at", { ascending: false });

  const assignmentIds = (asg ?? []).map((a) => a.id);
  let subs: { assignment_id: string; student_id: string; skor: number | null }[] =
    [];
  if (assignmentIds.length) {
    const { data: sb } = await supabase
      .from("submissions")
      .select("assignment_id, student_id, skor")
      .in("assignment_id", assignmentIds);
    subs = sb ?? [];
  }

  const students: EnrolledStudent[] = profiles.map((p) => {
    const mine = subs.filter((s) => s.student_id === p.id && s.skor != null);
    const avg = mine.length
      ? Math.round(
          mine.reduce((a, s) => a + (s.skor as number), 0) / mine.length,
        )
      : null;
    return {
      id: p.id,
      nama: p.nama || "(tanpa nama)",
      skorRataRata: avg,
      jumlahSelesai: mine.length,
    };
  });

  const topikOf = await fetchQuizTopics(
    supabase,
    (asg ?? []).map((a) => a.quiz_id),
  );

  const assignments: AssignmentRow[] = (asg ?? []).map((a) => ({
    id: a.id,
    judul: a.judul,
    quizId: a.quiz_id,
    topik: topikOf[a.quiz_id] ?? "",
    bobot: a.bobot ?? 100,
    deadline: a.deadline,
    jumlahSubmit: subs.filter((s) => s.assignment_id === a.id).length,
    totalSiswa: studentIds.length,
  }));

  return {
    id: c.id,
    nama: c.nama,
    tahunAjaran: c.tahun_ajaran,
    joinCode: c.join_code,
    students,
    assignments,
  };
}

export async function getTeacherDashboard(): Promise<TeacherDashboard> {
  if (!isSupabaseConfigured) {
    const all = seedClasses.flatMap((c) => c.students);
    return {
      totalSiswa: all.length,
      rataSkor: all.length
        ? Math.round(all.reduce((a, s) => a + s.skorTerakhir, 0) / all.length)
        : 0,
      jumlahKelas: seedClasses.length,
      jumlahTugas: 0,
      perhatian: seedClasses.flatMap((c) =>
        c.students
          .filter((s) => s.perluPerhatian)
          .map((s) => ({ id: s.id, nama: s.nama, skor: s.skorTerakhir })),
      ),
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const empty: TeacherDashboard = {
    totalSiswa: 0,
    rataSkor: 0,
    jumlahKelas: 0,
    jumlahTugas: 0,
    perhatian: [],
  };
  if (!user) return empty;

  const { data: cls } = await supabase
    .from("classes")
    .select("id")
    .eq("teacher_id", user.id);
  const classIds = (cls ?? []).map((c) => c.id);
  if (!classIds.length) return empty;

  const { data: en } = await supabase
    .from("enrollments")
    .select("student_id")
    .in("class_id", classIds);
  const studentIds = Array.from(new Set((en ?? []).map((e) => e.student_id)));

  const { data: asg } = await supabase
    .from("assignments")
    .select("id")
    .in("class_id", classIds);
  const assignmentIds = (asg ?? []).map((a) => a.id);

  let subs: { student_id: string; skor: number | null }[] = [];
  if (assignmentIds.length) {
    const { data: sb } = await supabase
      .from("submissions")
      .select("student_id, skor")
      .in("assignment_id", assignmentIds);
    subs = sb ?? [];
  }

  const scored = subs.filter((s) => s.skor != null);
  const rataSkor = scored.length
    ? Math.round(
        scored.reduce((a, s) => a + (s.skor as number), 0) / scored.length,
      )
    : 0;

  let profiles: { id: string; nama: string }[] = [];
  if (studentIds.length) {
    const { data: pr } = await supabase
      .from("profiles")
      .select("id, nama")
      .in("id", studentIds);
    profiles = pr ?? [];
  }

  const perhatian = profiles
    .map((p) => {
      const mine = subs.filter((s) => s.student_id === p.id && s.skor != null);
      const avg = mine.length
        ? Math.round(
            mine.reduce((a, s) => a + (s.skor as number), 0) / mine.length,
          )
        : null;
      return { id: p.id, nama: p.nama || "(tanpa nama)", skor: avg };
    })
    .filter((x) => x.skor === null || x.skor < 70)
    .slice(0, 6);

  return {
    totalSiswa: studentIds.length,
    rataSkor,
    jumlahKelas: classIds.length,
    jumlahTugas: assignmentIds.length,
    perhatian,
  };
}

/** Kelas milik guru yang sedang login. */
async function myClasses(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
): Promise<{ id: string; nama: string }[]> {
  const { data } = await supabase
    .from("classes")
    .select("id, nama")
    .eq("teacher_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

/**
 * Rata-rata skor per topik — analitik nyata untuk dashboard.
 * Sebelumnya chart ini memakai angka hardcoded; kini dihitung dari
 * submissions milik kelas guru, dikelompokkan per topik kuis.
 */
export async function getTeacherTopicScores(): Promise<
  { label: string; value: number }[]
> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const classes = await myClasses(supabase, user.id);
  if (!classes.length) return [];

  const { data: asg } = await supabase
    .from("assignments")
    .select("id, quiz_id")
    .in(
      "class_id",
      classes.map((c) => c.id),
    );
  if (!asg || !asg.length) return [];

  const { data: sb } = await supabase
    .from("submissions")
    .select("assignment_id, skor")
    .in(
      "assignment_id",
      asg.map((a) => a.id),
    )
    .not("skor", "is", null);
  if (!sb || !sb.length) return [];

  const topikOf = await fetchQuizTopics(
    supabase,
    asg.map((a) => a.quiz_id),
  );
  const quizOfAsg: Record<string, string> = {};
  asg.forEach((a) => {
    quizOfAsg[a.id] = a.quiz_id;
  });

  const acc: Record<string, { sum: number; n: number }> = {};
  for (const s of sb) {
    const topik =
      (topikOf[quizOfAsg[s.assignment_id]] ?? "").trim() || "Tanpa topik";
    acc[topik] ??= { sum: 0, n: 0 };
    acc[topik].sum += s.skor as number;
    acc[topik].n += 1;
  }

  return Object.entries(acc)
    .map(([label, { sum, n }]) => ({ label, value: Math.round(sum / n) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6); // chart batang jadi sesak bila lebih dari ini
}

/** Semua tugas guru lintas kelas (halaman /tugas). */
export async function getTeacherAssignments(): Promise<TeacherAssignment[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const classes = await myClasses(supabase, user.id);
  if (!classes.length) return [];
  const classIds = classes.map((c) => c.id);
  const namaKelas: Record<string, string> = {};
  classes.forEach((c) => {
    namaKelas[c.id] = c.nama;
  });

  const { data: asg } = await supabase
    .from("assignments")
    .select("id, judul, quiz_id, bobot, lampiran, deadline, class_id")
    .in("class_id", classIds)
    .order("created_at", { ascending: false });
  if (!asg || !asg.length) return [];

  const [{ data: en }, { data: sb }, topikOf] = await Promise.all([
    supabase.from("enrollments").select("class_id").in("class_id", classIds),
    supabase
      .from("submissions")
      .select("assignment_id")
      .in(
        "assignment_id",
        asg.map((a) => a.id),
      ),
    fetchQuizTopics(
      supabase,
      asg.map((a) => a.quiz_id),
    ),
  ]);

  const totalSiswa: Record<string, number> = {};
  (en ?? []).forEach((e) => {
    totalSiswa[e.class_id] = (totalSiswa[e.class_id] ?? 0) + 1;
  });
  const submitCount: Record<string, number> = {};
  (sb ?? []).forEach((s) => {
    submitCount[s.assignment_id] = (submitCount[s.assignment_id] ?? 0) + 1;
  });

  return asg.map((a) => ({
    id: a.id,
    judul: a.judul,
    quizId: a.quiz_id,
    topik: topikOf[a.quiz_id] ?? "",
    bobot: a.bobot ?? 100,
    deadline: a.deadline,
    classId: a.class_id,
    kelas: namaKelas[a.class_id] ?? "",
    jumlahSubmit: submitCount[a.id] ?? 0,
    totalSiswa: totalSiswa[a.class_id] ?? 0,
    lampiran: parseAttachments(a.lampiran),
  }));
}

/** Semua siswa yang diampu guru, lintas kelas (halaman /siswa). */
export async function getTeacherStudents(): Promise<TeacherStudent[]> {
  if (!isSupabaseConfigured) {
    return seedClasses.flatMap((c) =>
      c.students.map((s) => ({
        id: s.id,
        nama: s.nama,
        kelas: [c.nama],
        skorRataRata: s.skorTerakhir,
        jumlahSelesai: 1,
      })),
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const classes = await myClasses(supabase, user.id);
  if (!classes.length) return [];
  const classIds = classes.map((c) => c.id);
  const namaKelas: Record<string, string> = {};
  classes.forEach((c) => {
    namaKelas[c.id] = c.nama;
  });

  const { data: en } = await supabase
    .from("enrollments")
    .select("class_id, student_id")
    .in("class_id", classIds);
  if (!en || !en.length) return [];

  const studentIds = Array.from(new Set(en.map((e) => e.student_id)));
  const kelasOf: Record<string, string[]> = {};
  en.forEach((e) => {
    (kelasOf[e.student_id] ??= []).push(namaKelas[e.class_id] ?? "");
  });

  const { data: asg } = await supabase
    .from("assignments")
    .select("id")
    .in("class_id", classIds);
  const asgIds = (asg ?? []).map((a) => a.id);

  let subs: { student_id: string; skor: number | null }[] = [];
  if (asgIds.length) {
    const { data: sb } = await supabase
      .from("submissions")
      .select("student_id, skor")
      .in("assignment_id", asgIds);
    subs = sb ?? [];
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, nama")
    .in("id", studentIds);

  return (profiles ?? [])
    .map((p) => {
      const mine = subs.filter((s) => s.student_id === p.id && s.skor != null);
      return {
        id: p.id,
        nama: p.nama || "(tanpa nama)",
        kelas: kelasOf[p.id] ?? [],
        skorRataRata: mine.length
          ? Math.round(
              mine.reduce((a, s) => a + (s.skor as number), 0) / mine.length,
            )
          : null,
        jumlahSelesai: mine.length,
      };
    })
    .sort((a, b) => a.nama.localeCompare(b.nama));
}

export async function getStudentDetail(
  id: string,
): Promise<StudentDetail | null> {
  if (!isSupabaseConfigured) {
    const f = seedFindStudent(id);
    if (!f) return null;
    return {
      nama: f.student.nama,
      kelasNama: f.kelas.nama,
      demo: true,
      submissions: [],
    };
  }

  const supabase = await createClient();
  const { data: p } = await supabase
    .from("profiles")
    .select("nama")
    .eq("id", id)
    .maybeSingle();
  if (!p) return null;

  const { data: sb } = await supabase
    .from("submissions")
    .select("skor, submitted_at, assignment_id")
    .eq("student_id", id)
    .order("submitted_at", { ascending: false });

  const asgIds = Array.from(new Set((sb ?? []).map((s) => s.assignment_id)));
  const judulOf: Record<string, string> = {};
  if (asgIds.length) {
    const { data: asg } = await supabase
      .from("assignments")
      .select("id, judul")
      .in("id", asgIds);
    (asg ?? []).forEach((a) => {
      judulOf[a.id] = a.judul;
    });
  }

  return {
    nama: p.nama || "(tanpa nama)",
    kelasNama: null,
    demo: false,
    submissions: (sb ?? []).map((s) => ({
      judul: judulOf[s.assignment_id] ?? "Tugas",
      skor: s.skor,
      submittedAt: s.submitted_at,
    })),
  };
}

// ── Siswa ──────────────────────────────────────────────────────

export async function getStudentAssignments(): Promise<StudentAssignment[]> {
  if (!isSupabaseConfigured) {
    return seedQuizzes
      .filter((q) => q.sumber === "Tugas Guru")
      .map((q) => ({
        assignmentId: q.id,
        quizId: q.id,
        judul: q.judul,
        topik: q.topik,
        deskripsi: "",
        bobot: 100,
        lampiran: [],
        deadline: q.deadline ?? null,
        status: deriveStatus(false, q.deadline ?? null),
        sudahDikerjakan: false,
        skor: null,
        kelas: "XI Farmasi A",
      }));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: en } = await supabase
    .from("enrollments")
    .select("class_id")
    .eq("student_id", user.id);
  const classIds = (en ?? []).map((e) => e.class_id);
  if (!classIds.length) return [];

  const { data: asg } = await supabase
    .from("assignments")
    .select("id, judul, quiz_id, deskripsi, bobot, lampiran, deadline, class_id")
    .in("class_id", classIds)
    .order("created_at", { ascending: false });
  if (!asg || !asg.length) return [];

  const { data: cls } = await supabase
    .from("classes")
    .select("id, nama")
    .in("id", classIds);
  const classNameOf: Record<string, string> = {};
  (cls ?? []).forEach((c) => {
    classNameOf[c.id] = c.nama;
  });

  const asgIds = asg.map((a) => a.id);
  const [{ data: sb }, topikOf] = await Promise.all([
    supabase
      .from("submissions")
      .select("assignment_id, skor")
      .eq("student_id", user.id)
      .in("assignment_id", asgIds),
    fetchQuizTopics(
      supabase,
      asg.map((a) => a.quiz_id),
    ),
  ]);
  const skorOf = new Map<string, number | null>();
  (sb ?? []).forEach((s) => skorOf.set(s.assignment_id, s.skor));

  return asg.map((a) => ({
    assignmentId: a.id,
    quizId: a.quiz_id,
    judul: a.judul,
    topik: topikOf[a.quiz_id] ?? "",
    deskripsi: a.deskripsi ?? "",
    bobot: a.bobot ?? 100,
    lampiran: parseAttachments(a.lampiran),
    deadline: a.deadline,
    status: deriveStatus(skorOf.has(a.id), a.deadline),
    sudahDikerjakan: skorOf.has(a.id),
    skor: skorOf.has(a.id) ? (skorOf.get(a.id) ?? null) : null,
    kelas: classNameOf[a.class_id] ?? "",
  }));
}

/** Satu tugas milik siswa (untuk halaman detail /natulearn/tugas/[id]). */
export async function getStudentAssignment(
  assignmentId: string,
): Promise<StudentAssignment | null> {
  if (!isSupabaseConfigured) {
    const all = await getStudentAssignments();
    return all.find((a) => a.assignmentId === assignmentId) ?? null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // RLS assignments_select memastikan hanya tugas kelas yang diikuti terbaca.
  const { data: a } = await supabase
    .from("assignments")
    .select("id, judul, quiz_id, deskripsi, bobot, lampiran, deadline, class_id")
    .eq("id", assignmentId)
    .maybeSingle();
  if (!a) return null;

  const [{ data: c }, { data: s }, topikOf] = await Promise.all([
    supabase.from("classes").select("nama").eq("id", a.class_id).maybeSingle(),
    supabase
      .from("submissions")
      .select("skor")
      .eq("assignment_id", assignmentId)
      .eq("student_id", user.id)
      .maybeSingle(),
    fetchQuizTopics(supabase, [a.quiz_id]),
  ]);

  const sudah = !!s;
  return {
    assignmentId: a.id,
    quizId: a.quiz_id,
    judul: a.judul,
    topik: topikOf[a.quiz_id] ?? "",
    deskripsi: a.deskripsi ?? "",
    bobot: a.bobot ?? 100,
    lampiran: parseAttachments(a.lampiran),
    deadline: a.deadline,
    status: deriveStatus(sudah, a.deadline),
    sudahDikerjakan: sudah,
    skor: s?.skor ?? null,
    kelas: c?.nama ?? "",
  };
}
