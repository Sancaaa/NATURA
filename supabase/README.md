# Backend Supabase (Self-Host) — Fase 1

Autentikasi + database untuk NATURA. Semua berjalan di infrastruktur sendiri
(on-premise/VPS), **tanpa GPU**. Bila env Supabase kosong, aplikasi tetap jalan
dalam **mode demo** (data contoh, tanpa login) — jadi backend ini opsional
sampai Anda siap.

## Isi folder

- `schema.sql` — tabel, trigger profil, fungsi bantu, dan **Row-Level Security**.
- `seed.sql` — konten awal (tanaman, alat, library, kuis, anotasi AR).
- `migrations/` — riwayat perubahan skema. Migrasi
  `20260713120000_admin_ar_upload.sql` menambah: kolom `ar_target_url` pada
  `lab_tools`, tabel `content_annotations`, dan **bucket Storage publik `assets`**
  (untuk unggah `.glb`/`.mind`; tulis dibatasi admin).

Terapkan perubahan: `npx supabase db push` (atau jalankan file SQL di Studio).
Bucket `assets` juga dibuat oleh `schema.sql`.

## Cara menjalankan

### Opsi A — Cepat untuk pengembangan (Supabase CLI)

Butuh Docker.

```bash
npx supabase init          # sekali saja
npx supabase start         # menjalankan Postgres+Auth+Studio via Docker
```

Catat output `API URL`, `anon key`, dan `service_role key`.

### Opsi B — Self-host produksi (on-premise/VPS)

Ikuti Supabase self-hosting resmi (Docker Compose):

```bash
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker
cp .env.example .env        # ganti semua password/secret default!
docker compose up -d
```

Studio ada di `http://<host>:8000`. Di produksi, letakkan di belakang
reverse proxy (Caddy/TLS) dan akses DB dari app via VPN privat
(WireGuard/Tailscale) — lihat `docs/02-tech-stack.md`.

## Terapkan skema & data

Lewat **Studio → SQL Editor**: tempel isi `schema.sql`, jalankan; lalu
`seed.sql`, jalankan. Atau via psql:

```bash
psql "$DATABASE_URL" -f supabase/schema.sql
psql "$DATABASE_URL" -f supabase/seed.sql
```

## Sambungkan ke aplikasi

Salin ke `.env.local` di root proyek:

```
NEXT_PUBLIC_SUPABASE_URL=<API URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service_role key>   # opsional, server saja
```

Restart `npm run dev`. Halaman awal kini menampilkan **Masuk/Daftar**.

## Catatan

- **Email confirmation**: untuk dev, matikan di Auth settings (Studio →
  Authentication → Providers → Email → *Confirm email* off) agar daftar
  langsung mendapat sesi. Di produksi, aktifkan + pasang SMTP.
- **Peran & satu login.** Semua peran memakai **satu halaman login** (`/masuk`);
  setelah masuk, pengguna diarahkan sesuai perannya (murid → `/beranda`,
  guru → `/dashboard`, admin → `/admin`). Pendaftaran (`/daftar`) hanya membuat
  **murid** atau **guru**; trigger `handle_new_user` menyimpan `nama`, `email`,
  dan `role` ke `profiles`.
- **Membuat admin pertama** (bootstrap) lewat SQL setelah akun terdaftar:
  ```sql
  update public.profiles set role = 'admin'
  where id = (select id from auth.users where email = 'email-anda@sekolah.id');
  ```
  Login lagi → diarahkan ke `/admin`. Dari sana **admin dapat mengubah peran
  akun lain** (murid/guru/admin) tanpa SQL lagi.
- **Kepemilikan jelas.** Kelas → `teacher_id` guru pembuat; tugas → miliki lewat
  kelasnya; submission/attempt → `student_id` siswa; kuis buatan guru →
  `created_by`. RLS memastikan tiap peran hanya mengakses datanya.
- **RLS aktif** di semua tabel: siswa hanya melihat datanya & kelas yang
  diikuti; guru hanya kelas yang diampu. Uji dengan dua akun berbeda.
- **Data siswa (anak di bawah umur)** tersimpan di infrastruktur Anda; hanya
  teks pertanyaan tutor yang dikirim ke Gemini.
