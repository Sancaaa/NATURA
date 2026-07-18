-- ============================================================
-- NATURA — Gambar preview untuk tanaman & alat lab.
-- Dipakai sebagai foto pada kartu jelajah (fallback emoji bila kosong).
-- Idempoten.
-- ============================================================
alter table public.plants    add column if not exists gambar_url text;
alter table public.lab_tools  add column if not exists gambar_url text;
