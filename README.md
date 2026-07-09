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
| Teknologi AR | Image-tracking WebAR (MindAR + Three.js) — kartu = *image target*, jalan di browser Android **dan** iOS |
| Backend & data | Supabase **self-hosted** (Postgres + Auth + Storage + Realtime + RLS, `pgvector`) di infrastruktur sendiri |
| Tutor & kuis AI | **Google Gemini Flash** (API cloud) + RAG (pgvector, embedding jalan di CPU) |
| Framework | Next.js (App Router) + TypeScript, satu codebase untuk siswa & guru |
| Hosting | **Self-host tanpa GPU**: app di VPS (Caddy + TLS otomatis), database & storage di on-premise, terhubung lewat VPN privat |

> Detail dan alasan tiap keputusan ada di dokumen `docs/`.

## Peta Dokumen

1. [Kebutuhan Produk](docs/01-kebutuhan-produk.md) — visi, persona, daftar fitur (yang sudah dirapikan & ditambah), kebutuhan fungsional & non-fungsional.
2. [Tech Stack & Arsitektur](docs/02-tech-stack.md) — pilihan teknologi, arsitektur sistem, pendekatan AR, integrasi LLM + RAG.
3. [Desain Sistem & UX](docs/03-desain-sistem.md) — design system, alur UX siswa (mobile) & guru (desktop), state UX untuk AR, aksesibilitas.
4. [Model Data](docs/04-model-data.md) — entitas utama, skema, dan aturan Row-Level Security.
5. [Roadmap](docs/05-roadmap.md) — lingkup MVP, fase pengembangan, risiko & mitigasi.

## Status

**Fase 0 (mockup fungsional) sudah di-scaffold** — Next.js + design system, data contoh, layar siswa & guru, viewer 3D, dan halaman AR (MindAR). Sudah lolos `next build`. Lingkup & fase lanjut ada di [docs/05-roadmap.md](docs/05-roadmap.md).

## Menjalankan Mockup (Fase 0)

```bash
npm install
npm run dev        # buka http://localhost:3000
```

- Halaman awal `/` → pilih peran **Siswa** (`/beranda`) atau **Guru** (`/dashboard`).
- Semua data masih **contoh** (di `lib/data/`) — belum ada database/login.
- **Tutor AI**: tanpa key memakai jawaban contoh. Untuk jawaban nyata (Gemini Flash), salin `.env.example` → `.env.local` lalu isi `GEMINI_API_KEY`.
- **Mode AR (kamera)**: butuh aset — `public/ar/targets.mind` (target kartu) & `public/models/plant.glb` (model). Petunjuk di `public/ar/README.md`. Tombol **Lihat 3D** sudah berjalan tanpa aset.

Struktur singkat: `app/(student)/` layar siswa · `app/(teacher)/` layar guru · `components/` UI + viewer 3D/AR · `lib/data/` data contoh · `app/api/tutor/` endpoint tutor.

## Fase 1 — Mengaktifkan Backend (opsional)

Autentikasi + database (Supabase self-host) sudah disiapkan. Selama env
Supabase kosong, aplikasi tetap jalan **mode demo** (di atas). Untuk mengaktifkan
login berperan (siswa/guru) & data persisten, ikuti [supabase/README.md](supabase/README.md):
jalankan Supabase self-host, terapkan `supabase/schema.sql` + `supabase/seed.sql`,
lalu isi `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY` di `.env.local`.
