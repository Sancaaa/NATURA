import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  classes as seedClasses,
  findStudent as seedFindStudent,
} from "@/lib/data/classroom";
import { quizzes as seedQuizzes } from "@/lib/data/quizzes";

const quizTopik = (quizId: string) =>
  seedQuizzes.find((q) => q.id === quizId)?.topik ?? "";

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
  deadline: string | null;
  sudahDikerjakan: boolean;
  skor: number | null;
  kelas: string;
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
    .select("id, judul, quiz_id, deadline")
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

  const assignments: AssignmentRow[] = (asg ?? []).map((a) => ({
    id: a.id,
    judul: a.judul,
    quizId: a.quiz_id,
    topik: quizTopik(a.quiz_id),
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
        deadline: q.deadline ?? null,
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
    .select("id, judul, quiz_id, deadline, class_id")
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
  const { data: sb } = await supabase
    .from("submissions")
    .select("assignment_id, skor")
    .eq("student_id", user.id)
    .in("assignment_id", asgIds);
  const skorOf = new Map<string, number | null>();
  (sb ?? []).forEach((s) => skorOf.set(s.assignment_id, s.skor));

  return asg.map((a) => ({
    assignmentId: a.id,
    quizId: a.quiz_id,
    judul: a.judul,
    topik: quizTopik(a.quiz_id),
    deadline: a.deadline,
    sudahDikerjakan: skorOf.has(a.id),
    skor: skorOf.has(a.id) ? (skorOf.get(a.id) ?? null) : null,
    kelas: classNameOf[a.class_id] ?? "",
  }));
}
