# NATURA

**N**atural **A**ugmented **T**echnology for **U**nderstanding and **R**esearch in Pharmacognosy

Aplikasi web-based (PWA) untuk pembelajaran **Farmakognosi** siswa SMK Farmasi, memanfaatkan **AR card** untuk visualisasi tanaman & alat lab, **simulasi langkah laboratorium**, **library** materi, **tutor LLM**, dan **kuis** (latihan generatif maupun tugas dari guru).

- **Sisi siswa** → mobile-first (PWA, dipakai lewat kamera HP untuk AR)
- **Sisi guru** → desktop-first (dashboard pemantauan & penugasan)

---

## Ringkasan Konsep

| Aspek | Keputusan |
|---|---|
| Bentuk aplikasi | Progressive Web App (installable, offline-capable), bukan native |
| Teknologi AR | Image-tracking WebAR (MindAR + Three.js) - kartu = *image target*, jalan di browser Android **dan** iOS |
| Backend & data | Supabase (Postgres + Auth + Storage + Realtime + RLS, `pgvector`) - **Cloud** atau **self-host** |
| Tutor & kuis AI | **Google Gemini Flash** (API cloud) + RAG (pgvector, embedding jalan di CPU) |
| Framework | Next.js (App Router) + TypeScript, satu codebase untuk siswa & guru |
| Hosting | **Self-host tanpa GPU**: app di VPS (Caddy + TLS otomatis), database & storage di on-premise, terhubung lewat VPN privat |

> Detail dan alasan tiap keputusan ada di dokumen `docs/`.

## Peta Dokumen

1. [Kebutuhan Produk](docs/01-kebutuhan-produk.md) - visi, persona, daftar fitur (yang sudah dirapikan & ditambah), kebutuhan fungsional & non-fungsional.
2. [Tech Stack & Arsitektur](docs/02-tech-stack.md) - pilihan teknologi, arsitektur sistem, pendekatan AR, integrasi LLM + RAG.
3. [Desain Sistem & UX](docs/03-desain-sistem.md) - design system, alur UX siswa (mobile) & guru (desktop), state UX untuk AR, aksesibilitas.
4. [Model Data](docs/04-model-data.md) - entitas utama, skema, dan aturan Row-Level Security.
5. [Roadmap](docs/05-roadmap.md) - lingkup MVP, fase pengembangan, risiko & mitigasi.

## Status

**Fase 1+ berjalan** (bukan lagi sekadar mockup). Sudah tersedia:

- **Konten di database** - tanaman, alat, dan library dibaca dari Postgres (Supabase), dengan *fallback* ke data contoh (`lib/data/`) saat Supabase nonaktif ("mode demo").
- **Autentikasi berperan** - siswa / guru / admin, dijaga RLS.
- **Panel admin** (`/admin`) - kelola pengguna (buat akun, ubah peran, hapus), **CRUD konten** (tanaman/alat/library), **unggah `.glb`/`.mind`** ke Supabase Storage, dan **editor titik highlight AR** (3D klik-untuk-tempat).
- **AR data-driven** - tanaman **dan alat** bisa dipindai; `public/ar/viewer.html` memuat model + target + anotasi per konten dari `/api/ar/[type]/[id]`.
- **Kuis** manual **dan generatif** (Gemini Flash) + **kelas & penugasan** guru.

Sudah lolos `next build`. Fase lanjut (RAG, simulasi lab multi-kartu) ada di [docs/05-roadmap.md](docs/05-roadmap.md).

## Menjalankan

```bash
npm install
npm run dev        # buka http://localhost:3000
```

- Halaman awal `/` → login (atau **mode demo** tanpa login bila env Supabase kosong).
- **Mode demo**: tanpa Supabase, data memakai contoh di `lib/data/` - berguna untuk pratinjau cepat tanpa backend.
- **Tutor AI**: tanpa key memakai jawaban contoh. Untuk jawaban nyata (Gemini Flash), isi `GEMINI_API_KEY` di `.env.local`.
- **Mode AR (kamera)**: aset `.glb`/`.mind` diunggah lewat panel admin (Tanaman/Alat) ke Storage, atau ditaruh statis di `public/`. Tombol **Lihat 3D** berjalan tanpa aset. Kamera butuh *secure context* (localhost/HTTPS).

Struktur singkat: `app/(student)/` layar siswa · `app/(teacher)/` layar guru · `app/(admin)/` panel admin · `components/` UI + viewer 3D/AR + form admin · `lib/db/` baca DB (fallback contoh) · `lib/actions/` server action (CRUD) · `lib/data/` data contoh/fallback · `app/api/` endpoint tutor & AR.

## Mengaktifkan Backend (Supabase)

Autentikasi + database. Selama env Supabase kosong, aplikasi tetap jalan **mode demo**.
Untuk data persisten & login berperan, ikuti [supabase/README.md](supabase/README.md):

1. Siapkan proyek Supabase (**Cloud** atau self-host).
2. Terapkan `supabase/schema.sql` + `supabase/seed.sql`, lalu migrasi di `supabase/migrations/` (via SQL Editor atau `supabase db push`).
3. Isi `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan `SUPABASE_SERVICE_ROLE_KEY` (untuk buat/hapus akun) di `.env.local`.
