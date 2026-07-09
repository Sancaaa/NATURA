# 01 — Kebutuhan Produk (PRD)

## Visi

NATURA membuat Farmakognosi — mata pelajaran yang selama ini dominan hafalan (simplisia, morfologi, kandungan kimia, prosedur lab) — menjadi **visual, interaktif, dan bisa dieksplorasi mandiri**. Siswa memakai kartu AR untuk "membangkitkan" tanaman dan alat lab dalam 3D, mensimulasikan langkah laboratorium, bertanya ke tutor AI, dan berlatih kuis. Guru memantau dan menugaskan dari dashboard.

## Konteks Kurikulum (Farmakognosi SMK Farmasi)

Fitur harus memetakan ke materi nyata, antara lain:

- **Simplisia**: nabati, hewani, mineral — definisi, tata nama, syarat mutu.
- **Morfologi tumbuhan**: akar, batang, daun, bunga, buah, biji.
- **Identifikasi**: pemeriksaan makroskopik & mikroskopik simplisia (fragmen pengenal).
- **Kandungan kimia / metabolit sekunder**: alkaloid, flavonoid, tanin, saponin, glikosida, minyak atsiri.
- **Pembuatan simplisia**: pengumpulan → sortasi basah → pencucian → perajangan → pengeringan → sortasi kering → pengepakan/penyimpanan.
- **Ekstraksi**: maserasi, perkolasi, sokletasi, infusa, dekokta.
- **Alat laboratorium**: mikroskop, mortar & stamper, timbangan analitik, oven, moisture balance, soxhlet, rotary evaporator, dll.

Prinsip: **AR untuk yang sulit dibayangkan** (bentuk 3D tanaman, fragmen mikroskopik, urutan proses), bukan sekadar gimmick.

## Persona

| Persona | Karakteristik | Implikasi desain |
|---|---|---|
| **Siswa SMK Farmasi** (±15–18 th) | Mobile-first, HP kelas menengah/bawah, koneksi tidak selalu stabil, waktu belajar terpecah | PWA ringan, offline-capable, AR harus jalan di device sederhana, target sentuh besar |
| **Guru Farmakognosi** | Desktop/laptop, mengampu beberapa kelas, butuh lihat progres cepat & menilai | Dashboard padat data, tabel & grafik, alur assign tugas cepat |
| **Admin sekolah** (opsional) | Kelola akun & konten master | Panel manajemen terpisah, hak akses penuh |

## Daftar Fitur (dirapikan & diperluas dari ide awal)

### Sisi Siswa (mobile)

1. **AR Visualisasi Tanaman** — scan kartu tanaman → model 3D + panel info (nama lokal/latin, familia, bagian dipakai, nama simplisia, kandungan, khasiat, ciri makroskopik & mikroskopik). Bisa rotate/zoom.
2. **AR Alat Laboratorium** — scan kartu alat → 3D alat + fungsi + cara pakai + tips keselamatan.
3. **Simulasi Lab (multi-kartu)** — scan kartu satu per satu sesuai urutan langkah (mis. pembuatan simplisia, atau ekstraksi maserasi). Aplikasi mendeteksi urutan & memberi umpan balik benar/salah tiap langkah, plus animasi hasil. *(Fitur inti pembeda NATURA.)*
4. **Library** — buku/artikel/modul yang bisa dibaca; **tersimpan untuk baca offline**; bookmark & pencarian.
5. **Tutor AI (LLM)** — tanya-jawab seputar farmakognosi, jawaban **di-grounding ke library** (RAG) dan menyertakan sumber; level bahasa disesuaikan SMK.
6. **Kuis / Latihan** — dua mode: (a) **generatif** (AI membuat soal dari topik/materi untuk latihan mandiri), (b) **ditugaskan guru**. Skoring otomatis + pembahasan.
7. **Progres pribadi** — riwayat belajar, skor, materi yang sudah dieksplor.
8. **Notifikasi tugas** — pengingat deadline (opsional, butuh push).
9. **Gamifikasi** *(opsional, fase lanjut)* — poin, badge, streak.

### Sisi Guru (desktop)

1. **Dashboard pemantauan** — ringkasan kelas: progres siswa, rata-rata skor kuis, aktivitas AR/simulasi, siswa yang tertinggal.
2. **Manajemen kelas** — buat kelas, enroll siswa (kode kelas / undangan).
3. **Penugasan** — assign kuis/tugas ke kelas dengan deadline.
4. **Bank soal & pembuatan kuis** — susun kuis manual **atau** generatif (AI menyusun draf soal → guru **review & edit sebelum publish**).
5. **Detail per siswa** — lihat riwayat, jawaban, dan (untuk keamanan) percakapan tutor AI.
6. **Ekspor nilai** — unduh rekap (CSV/Excel).
7. **Manajemen konten** *(guru/admin)* — kelola item library.

## Kebutuhan Fungsional (ringkas)

- Autentikasi & peran (siswa / guru / admin) dengan otorisasi ketat per peran.
- CRUD konten master: tanaman, alat, kartu AR, item library, simulasi.
- Pipeline AR: kartu → *image target* → aset 3D + konten.
- Pipeline kuis: bank soal, generatif AI (output terstruktur), attempt, skoring, pembahasan.
- Pipeline penugasan: assignment → submission → penilaian → rekap.
- RAG: ingest library → embedding → retrieval untuk tutor & sumber soal.
- Logging percakapan tutor untuk visibilitas guru & keamanan.

## Kebutuhan Non-Fungsional

| Kategori | Target |
|---|---|
| **Performa AR** | Lancar di Android mid-range; model 3D dioptimasi (Draco, hemat poligon, target < 2–5 MB/aset). |
| **Offline-first** | App shell, aset AR (model & marker), dan item library yang diunduh tersedia offline. Tutor & kuis generatif tetap butuh jaringan (dinyatakan jelas ke pengguna). |
| **Lintas platform** | Chrome Android **dan** Safari iOS via image-tracking (bukan WebXR, karena WebXR AR tidak didukung Safari iOS). |
| **Keamanan & privasi** | Pengguna adalah **anak di bawah umur** → data minimal, izin/consent, Row-Level Security, enkripsi in-transit/at-rest, API key LLM **tidak pernah** di sisi klien. |
| **Keamanan konten AI** | Guardrail tutor (scope farmakognosi, bahasa sopan, tolak topik tak pantas), rate limit, moderasi, log tersimpan. |
| **Aksesibilitas** | Kontras WCAG 2.1 AA, target sentuh ≥ 44px, Bahasa Indonesia sebagai bahasa utama. |
| **Skalabilitas** | Multi-sekolah / multi-kelas. |
| **Biaya AI** | Dikontrol lewat *tiering* model, prompt caching, dan rate limit. |

## Di Luar Lingkup (untuk sekarang)

- Aplikasi native iOS/Android (cukup PWA).
- Marketplace konten pihak ketiga.
- Video conference / kelas live.
- AR markerless SLAM penuh (butuh 8th Wall berbayar) — dipertimbangkan bila ada anggaran.
