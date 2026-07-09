# 05 — Roadmap

Strategi disesuaikan dengan kebutuhan Anda: **mockup fungsional lebih dulu** — cukup mulus & lengkap secara visual untuk **direkam jadi video dokumentasi** — baru kemudian backend nyata, AI, dan simulasi. Durasi indikatif, bergantung ukuran tim.

## Fase 0 — Mockup Fungsional (untuk Video Dokumentasi) ⭐ prioritas awal

**Tujuan**: aplikasi terlihat & terasa "jadi" dan bisa diklik ujung-ke-ujung untuk direkam — **tanpa** harus membangun backend penuh dulu. Fokus ke tampilan, alur mulus, dan **satu momen AR yang benar-benar berfungsi** sebagai sorotan video.

**Lingkup:**

- **Front-end Next.js + design system** (tokens, komponen, nav siswa, layout dashboard guru).
- **Data dummy** (JSON/seed lokal atau state di aplikasi) — belum perlu database nyata.
- **AR beneran untuk demo**: **1 kartu tanaman** jalan penuh via MindAR + 1 model GLB, plus fallback "Lihat 3D". Ini bintang videonya.
- **Layar-layar inti bisa diklik** dengan data dummy:
  - Siswa: Beranda → Pindai (AR) → Library (baca 1 modul) → Kuis (statis, bisa dijawab & lihat skor) → Profil.
  - Guru: Dashboard dengan grafik & tabel data dummy, tampilan kelas & detail siswa.
- **Tutor AI**: colok cepat ke **Gemini Flash** (free tier) untuk chat yang benar-benar menjawab — atau distub dengan jawaban contoh bila ingin lebih cepat.
- **Deploy ke VPS** (Caddy + TLS) supaya bisa diakses & direkam dari perangkat nyata (HP untuk AR).
- Autentikasi cukup **placeholder** (pilih peran siswa/guru), belum perlu auth nyata.

**Deliverable**: purwarupa yang bisa direkam menampilkan alur siswa (termasuk momen AR) dan dashboard guru, live di URL.

**Yang sengaja ditunda ke fase berikut**: database & auth nyata, RLS, RAG, kuis generatif, simulasi multi-kartu, offline penuh.

## Fase 1 — Backend Nyata + MVP

**Tujuan**: mengubah mockup jadi aplikasi sungguhan (data persisten, multi-pengguna).

- **Self-host Supabase** (on-prem) + VPN privat ke VPS; skema DB dari [model data](04-model-data.md).
- **Auth + peran** (siswa/guru/admin) & **RLS** dasar.
- Pindahkan data dummy Fase 0 → database; konten master (tanaman/alat/library) nyata.
- **Kuis manual**: bank soal, attempt, skoring, pembahasan (persisten).
- **Guru**: buat kelas + kode gabung, enroll siswa, assign kuis, lihat skor & rekap.
- **Library**: caching offline (Workbox).
- **Deliverable**: alur belajar & penugasan lengkap untuk satu kelas percobaan, data tersimpan.

## Fase 2 — Tutor AI + Kuis Generatif + RAG

**Tujuan**: lapisan AI yang aman & hemat, dengan RAG tanpa GPU.

- **RAG**: ingest library → **embedding di CPU** (fastembed/ONNX) → pgvector.
- **Tutor Gemini Flash**: grounded + sumber, streaming, `safetySettings` ketat, guardrail, logging.
- **Kuis generatif**: structured output (`responseSchema`) → draf soal → **review guru** → publish.
- **Dashboard**: analitik lebih kaya (tren skor, aktivitas, siswa tertinggal) via Realtime.
- **Deliverable**: siswa bisa bertanya & berlatih soal generatif; guru memakai draf AI dengan aman.

## Fase 3 — Simulasi Lab Multi-Kartu

**Tujuan**: fitur pembeda inti NATURA.

- Deteksi urutan kartu (state machine, multi-target MindAR).
- Umpan balik per langkah + animasi hasil; simpan `lab_progress`.
- Minimal 2 simulasi (mis. pembuatan simplisia & ekstraksi maserasi).
- Gamifikasi (poin/badge/streak) — opsional.
- **Deliverable**: siswa menyelesaikan prosedur lab virtual bertahap.

## Fase 4 — Polish & Skala

- Perluas konten (tanaman & alat sesuai kurikulum penuh).
- Offline lebih lengkap; notifikasi push tugas.
- Audit aksesibilitas (WCAG 2.1 AA) & performa AR di device sederhana.
- Multi-sekolah; ekspor nilai; peran admin penuh.
- Hardening keamanan & privasi (data anak di bawah umur); backup & monitoring matang.

## Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| **Mockup dikira produk jadi** | Ekspektasi salah | Perjelas bahwa Fase 0 = purwarupa; simpan daftar "yang belum nyata" |
| **AR di iOS / device lemah** | Fitur inti tak jalan | Image-tracking (MindAR), bukan WebXR; fallback "Lihat 3D"; uji di device nyata sejak Fase 0 |
| **Produksi aset 3D lambat** | Konten sedikit | Prioritaskan 1 aset bagus untuk video; tambah bertahap sesuai kurikulum |
| **Ketergantungan cloud Gemini** | Butuh internet & kuota | Free tier untuk mockup; tier berbayar untuk produksi; guardrail + rate limit; sisanya self-host |
| **Ops self-host (tanpa GPU)** | Beban pemeliharaan | Docker Compose; VPN privat; backup terjadwal; mulai dari sizing kecil; alternatif ringan (Postgres+MinIO) bila Supabase self-host terlalu berat |
| **Privasi data anak** | Risiko kepatuhan | Data di on-prem; minim PII ke LLM; RLS ketat; consent & retensi |
| **Scope creep** | Rilis molor | Kunci Fase 0 (mockup) & Fase 1 (MVP) tanpa AI; AI & simulasi menyusul |

## Definisi "Selesai"

**Fase 0 (mockup untuk video):**
- Bisa merekam: buka app → pindai 1 kartu → model 3D + info muncul → baca 1 modul → kerjakan 1 kuis → lihat dashboard guru (data dummy).
- Live di URL VPS (HTTPS), jalan di Chrome Android **dan** Safari iOS.

**Fase 1 (MVP nyata):**
- Siswa: login → scan kartu → lihat 3D + info → baca modul offline → kerjakan kuis → lihat skor (tersimpan).
- Guru: buat kelas → enroll → assign kuis → lihat skor siswa.
