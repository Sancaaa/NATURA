-- ============================================================
-- NATURA — Menu NatuLab/NatuLearn: metadata tugas & lampiran.
--   assignments   : bobot, deskripsi, lampiran (file/link pendukung)
--   library_items : lampiran (file/link pendukung modul materi)
-- Status tugas TIDAK disimpan — diturunkan dari submissions + deadline.
-- Idempoten.
-- ============================================================
alter table public.assignments add column if not exists bobot int not null default 100;
alter table public.assignments add column if not exists deskripsi text;
alter table public.assignments add column if not exists lampiran jsonb not null default '[]';

alter table public.library_items add column if not exists lampiran jsonb not null default '[]';
