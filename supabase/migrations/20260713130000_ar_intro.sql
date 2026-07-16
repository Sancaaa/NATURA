-- ============================================================
-- NATURA — Teks intro AR (paragraf umum saat model AR pertama diketuk).
-- Editable terpisah dari khasiat/fungsi. Idempoten.
-- ============================================================
alter table public.plants add column if not exists ar_intro text;
alter table public.lab_tools add column if not exists ar_intro text;
