// ============================================================
// NATURA — Seed DEMO (proof of concept).
//
//   node scripts/seed-demo.mjs
//
// Mengisi akun + seluruh sisi guru (kelas, pendaftaran, kuis, tugas,
// pengumpulan bernilai, streak, modul guru). TIDAK menyentuh tanaman,
// alat lab, atau skenario praktikum. Idempoten (aman diulang).
//
// Memakai fetch langsung ke Auth Admin API + PostgREST (tanpa supabase-js)
// agar jalan di Node 20 tanpa WebSocket global.
//
// Akun (sandi semua: natura123):
//   admin@natura.sch.id · guru@natura.sch.id · siswa01..15@natura.sch.id
// ============================================================
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    }),
);
const BASE = (env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const SERVICE = env.SUPABASE_SERVICE_ROLE_KEY;
if (!BASE || !SERVICE) {
  console.error("URL/service role tidak ditemukan di .env.local");
  process.exit(1);
}
const H = {
  apikey: SERVICE,
  Authorization: `Bearer ${SERVICE}`,
  "Content-Type": "application/json",
};
const PASS = "natura123";
const TEACHER = "guru@natura.sch.id";

// --- Helper HTTP ---
async function listUsers() {
  const map = new Map();
  for (let page = 1; ; page++) {
    const r = await fetch(`${BASE}/auth/v1/admin/users?page=${page}&per_page=1000`, { headers: H });
    if (!r.ok) throw new Error(`listUsers ${r.status}: ${await r.text()}`);
    const data = await r.json();
    const users = data.users ?? data;
    for (const u of users) map.set(u.email, u.id);
    if (!users.length || users.length < 1000) break;
  }
  return map;
}
async function createUser(u) {
  const r = await fetch(`${BASE}/auth/v1/admin/users`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({
      email: u.email,
      password: PASS,
      email_confirm: true,
      user_metadata: { nama: u.nama, role: u.role },
    }),
  });
  if (!r.ok) throw new Error(`createUser ${u.email} ${r.status}: ${await r.text()}`);
  return (await r.json()).id;
}
async function upsert(table, rows, onConflict) {
  if (!rows.length) return;
  const url = `${BASE}/rest/v1/${table}` + (onConflict ? `?on_conflict=${onConflict}` : "");
  const r = await fetch(url, {
    method: "POST",
    headers: { ...H, Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(rows),
  });
  if (!r.ok) throw new Error(`upsert ${table} ${r.status}: ${await r.text()}`);
}
async function del(table, query) {
  const r = await fetch(`${BASE}/rest/v1/${table}?${query}`, {
    method: "DELETE",
    headers: { ...H, Prefer: "return=minimal" },
  });
  if (!r.ok) throw new Error(`delete ${table} ${r.status}: ${await r.text()}`);
}
async function count(table) {
  const r = await fetch(`${BASE}/rest/v1/${table}?select=*&limit=1`, {
    headers: { ...H, Prefer: "count=exact", "Range-Unit": "items", Range: "0-0" },
  });
  const cr = r.headers.get("content-range") || "/?";
  return cr.split("/")[1];
}

// --- Data ---
const CLASSES = [
  { id: "c1000000-0000-0000-0000-000000000001", nama: "XI Farmasi A", join: "NAT-1001" },
  { id: "c2000000-0000-0000-0000-000000000002", nama: "XI Farmasi B", join: "NAT-1002" },
  { id: "c3000000-0000-0000-0000-000000000003", nama: "XII Farmasi A", join: "NAT-1003" },
];
const STUDENT_NAMES = [
  "Aditya Pratama", "Siti Aminah", "Rizky Ramadhan", "Dewi Lestari", "Bagus Setiawan",
  "Nabila Putri", "Fajar Nugroho", "Intan Permata", "Yoga Saputra", "Alya Rahmawati",
  "Budi Santoso", "Citra Kirana", "Dimas Anggara", "Eka Wulandari", "Farhan Maulana",
];
const accounts = [
  { email: "admin@natura.sch.id", nama: "Admin NATURA", role: "admin" },
  { email: TEACHER, nama: "Dr. Sarah Wijaya", role: "teacher" },
  ...STUDENT_NAMES.map((nama, i) => ({
    email: `siswa${String(i + 1).padStart(2, "0")}@natura.sch.id`,
    nama,
    role: "student",
    classId: CLASSES[Math.floor(i / 5)].id,
  })),
];

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
const day = 86400000;

async function main() {
  console.log(`→ Seeding ke ${BASE}`);

  // 1) Akun
  const idByEmail = await listUsers();
  for (const a of accounts) {
    if (!idByEmail.has(a.email)) idByEmail.set(a.email, await createUser(a));
  }
  const id = (e) => idByEmail.get(e);
  console.log(`✓ Akun siap (${accounts.length} demo)`);

  // 2) Profil
  await upsert(
    "profiles",
    accounts.map((a) => ({ id: id(a.email), role: a.role, nama: a.nama, email: a.email })),
    "id",
  );

  // 3) Kelas
  await upsert(
    "classes",
    CLASSES.map((c) => ({
      id: c.id, teacher_id: id(TEACHER), nama: c.nama,
      tahun_ajaran: "2025/2026", join_code: c.join,
    })),
    "id",
  );

  // 4) Pendaftaran
  const students = accounts.filter((a) => a.role === "student");
  await upsert(
    "enrollments",
    students.map((a) => ({ class_id: a.classId, student_id: id(a.email) })),
    "class_id,student_id",
  );

  // 5) Kuis + soal
  const QUIZZES = [
    { id: "morfologi-tanaman", judul: "Kuis: Morfologi Tanaman Obat", topik: "Morfologi Tanaman" },
    { id: "metode-ekstraksi-kuis", judul: "Kuis: Metode Ekstraksi", topik: "Metode Ekstraksi" },
    { id: "alat-lab-kuis", judul: "Kuis: Pengenalan Alat Lab", topik: "Alat Laboratorium" },
  ];
  await upsert(
    "quizzes",
    QUIZZES.map((q) => ({
      id: q.id, judul: q.judul, topik: q.topik, sumber: "Tugas Guru",
      created_by: id(TEACHER), is_published: true,
    })),
    "id",
  );
  const QUESTIONS = [
    ["morfologi-tanaman", 1, "Bentuk tepi daun yang bergerigi disebut...", ["Rata (integer)", "Bergerigi (serratus)", "Berlekuk (lobatus)", "Berombak (repandus)"], 1, "Tepi daun bergerigi seperti gergaji disebut serratus."],
    ["morfologi-tanaman", 2, "Rimpang termasuk modifikasi dari organ...", ["Akar", "Batang", "Daun", "Bunga"], 1, "Rimpang (rhizoma) adalah batang yang menjalar di dalam tanah."],
    ["metode-ekstraksi-kuis", 1, "Metode ekstraksi dengan perendaman pada suhu ruang adalah...", ["Perkolasi", "Sokletasi", "Maserasi", "Destilasi"], 2, "Maserasi merendam simplisia dalam pelarut pada suhu ruang."],
    ["metode-ekstraksi-kuis", 2, "Ekstraksi berulang memakai alat khusus dan pelarut yang sama adalah...", ["Infusa", "Sokletasi", "Dekokta", "Maserasi"], 1, "Sokletasi memakai alat soklet untuk ekstraksi berulang."],
    ["alat-lab-kuis", 1, "Alat untuk menimbang bahan dengan ketelitian 0,0001 g adalah...", ["Neraca ohaus", "Timbangan analitik", "Gelas ukur", "Buret"], 1, "Timbangan analitik memiliki ketelitian hingga 0,0001 gram."],
    ["alat-lab-kuis", 2, "Bagian mikroskop yang mengatur fokus secara halus adalah...", ["Makrometer", "Mikrometer", "Revolver", "Diafragma"], 1, "Mikrometer (pemutar halus) memperjelas fokus."],
  ];
  await del("questions", `quiz_id=in.(${QUIZZES.map((q) => q.id).join(",")})`);
  await upsert(
    "questions",
    QUESTIONS.map(([quiz_id, urutan, pertanyaan, opsi, kunci, pembahasan]) => ({
      quiz_id, urutan, pertanyaan, opsi, kunci, pembahasan,
    })),
  );

  // 6) Penugasan
  const ASSIGNMENTS = [
    ["a1000000-0000-0000-0000-000000000001", CLASSES[0].id, "dasar-simplisia", "Tugas 1 — Dasar Simplisia", "Kerjakan kuis dasar simplisia sebagai pemanasan sebelum praktikum.", 100, [{ nama: "Ringkasan Materi.pdf", url: "https://example.com/ringkasan.pdf", tipe: "file" }], 5],
    ["a2000000-0000-0000-0000-000000000002", CLASSES[0].id, "morfologi-tanaman", "Tugas 2 — Morfologi Tanaman", "Amati morfologi pada modul lalu kerjakan kuis.", 80, [], -2],
    ["a3000000-0000-0000-0000-000000000003", CLASSES[1].id, "pembuatan-simplisia-kuis", "Tugas 1 — Pembuatan Simplisia", "Pahami tahapan pembuatan simplisia, kumpulkan sebelum tenggat.", 100, [{ nama: "Panduan Praktikum", url: "https://example.com/panduan", tipe: "link" }], 3],
    ["a4000000-0000-0000-0000-000000000004", CLASSES[1].id, "metode-ekstraksi-kuis", "Tugas 2 — Metode Ekstraksi", "Bandingkan metode ekstraksi lalu jawab kuis.", 90, [], -1],
    ["a5000000-0000-0000-0000-000000000005", CLASSES[2].id, "dasar-simplisia", "Tugas 1 — Dasar Simplisia", "Kuis penyegaran materi dasar simplisia.", 100, [], 7],
    ["a6000000-0000-0000-0000-000000000006", CLASSES[2].id, "alat-lab-kuis", "Tugas 2 — Pengenalan Alat Lab", "Kenali fungsi alat laboratorium sebelum sesi lab.", 75, [{ nama: "Daftar Alat.pdf", url: "https://example.com/alat.pdf", tipe: "file" }], -3],
    ["a7000000-0000-0000-0000-000000000007", CLASSES[2].id, "morfologi-tanaman", "Tugas 3 — Morfologi Tanaman", "Latihan morfologi menjelang ujian.", 85, [], 1],
  ];
  await upsert(
    "assignments",
    ASSIGNMENTS.map(([aid, class_id, quiz_id, judul, deskripsi, bobot, lampiran, dl]) => ({
      id: aid, class_id, quiz_id, judul, deskripsi, bobot, lampiran,
      deadline: new Date(Date.now() + dl * day).toISOString(),
    })),
    "id",
  );

  // 7) Pengumpulan bernilai (~82% siswa, skor 65..98; Budi sengaja rendah)
  const enrollByClass = new Map(CLASSES.map((c) => [c.id, []]));
  for (const s of students) enrollByClass.get(s.classId).push(id(s.email));
  const budi = id("siswa11@natura.sch.id");
  const subs = [];
  for (const [aid, class_id] of ASSIGNMENTS) {
    for (const sid of enrollByClass.get(class_id)) {
      const h = hash(sid + aid);
      if (h % 100 >= 82) continue;
      let skor = 65 + (h % 34);
      if (sid === budi) skor = 55 + (hash(aid) % 12);
      subs.push({
        assignment_id: aid, student_id: sid, skor, status: "submitted",
        submitted_at: new Date(Date.now() - (hash(aid + sid) % 10) * day).toISOString(),
        jawaban: {},
      });
    }
  }
  await upsert("submissions", subs, "assignment_id,student_id");

  // 8) Streak
  const streaks = [
    [id("siswa01@natura.sch.id"), 5],
    [id("siswa02@natura.sch.id"), 3],
    [id("siswa06@natura.sch.id"), 2],
  ];
  await del("quiz_attempts", `student_id=in.(${streaks.map((s) => s[0]).join(",")})`);
  const attempts = [];
  for (const [sid, days] of streaks)
    for (let n = 0; n < days; n++)
      attempts.push({
        quiz_id: "dasar-simplisia", student_id: sid, skor: 78 + n * 3,
        detail: {}, created_at: new Date(Date.now() - n * day).toISOString(),
      });
  await upsert("quiz_attempts", attempts);

  // 9) Modul guru
  await upsert(
    "library_items",
    [
      {
        id: "teknik-mikroskopi", judul: "Teknik Mikroskopi Dasar", tipe: "Modul",
        penulis: "Dr. Sarah Wijaya",
        ringkasan: "Menyiapkan preparat dan mengatur fokus mikroskop untuk pengamatan simplisia.",
        konten: [
          "Siapkan preparat: teteskan medium, letakkan sampel, tutup kaca penutup pada sudut 45° agar tak ada gelembung.",
          "Mulai dari perbesaran rendah, fokuskan dengan makrometer, perjelas dengan mikrometer.",
          "Identifikasi fragmen pengenal sesuai simplisia yang diamati.",
        ],
        offline: true,
        lampiran: [{ nama: "Checklist Mikroskop.pdf", url: "https://example.com/checklist.pdf", tipe: "file" }],
        created_by: id(TEACHER),
      },
      {
        id: "panduan-praktikum", judul: "Panduan Umum Praktikum", tipe: "Modul",
        penulis: "Dr. Sarah Wijaya",
        ringkasan: "Tata tertib, keselamatan kerja, dan format laporan praktikum.",
        konten: [
          "Kenakan jas lab, kenali alat keselamatan, ikuti instruksi asisten.",
          "Catat pengamatan sistematis: tujuan, alat/bahan, prosedur, hasil, pembahasan.",
          "Kumpulkan laporan sesuai tenggat pada tiap tugas.",
        ],
        offline: false,
        lampiran: [{ nama: "Template Laporan", url: "https://example.com/template", tipe: "link" }],
        created_by: id(TEACHER),
      },
    ],
    "id",
  );

  console.log("✓ Selesai. Ringkasan:");
  console.log(`   profiles=${await count("profiles")} classes=${await count("classes")} enrollments=${await count("enrollments")}`);
  console.log(`   assignments=${await count("assignments")} submissions=${await count("submissions")} attempts=${await count("quiz_attempts")}`);
  console.log(`\n   Login guru : ${TEACHER} / ${PASS}`);
  console.log(`   Login siswa: siswa01@natura.sch.id / ${PASS}`);
}

main().catch((e) => {
  console.error("✗", e.message);
  process.exit(1);
});
