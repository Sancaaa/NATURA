-- ============================================================
-- NATURA — Tambahan: alat scannable, storage upload, anotasi AR
-- Idempoten & aman dijalankan ulang. Melengkapi 20260101000000_init.sql.
-- ============================================================

-- Part B — alat bisa dipindai: target AR (.mind) untuk lab_tools ----
alter table public.lab_tools add column if not exists ar_target_url text;

-- Part D — titik highlight (anotasi) untuk model tanaman/alat -------
create table if not exists public.content_annotations (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null check (subject_type in ('plant', 'tool')),
  subject_id text not null,
  urutan int not null default 0,
  part_key text not null,
  label text not null,
  -- Titik pada model (koordinat objek-lokal 3D).
  pos_x double precision not null default 0,
  pos_y double precision not null default 0,
  pos_z double precision not null default 0,
  -- Ujung garis / posisi label.
  label_x double precision not null default 0,
  label_y double precision not null default 0,
  label_z double precision not null default 0,
  body text[] not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists content_annotations_subject_idx
  on public.content_annotations (subject_type, subject_id, urutan);

alter table public.content_annotations enable row level security;

drop policy if exists annotations_read on public.content_annotations;
drop policy if exists annotations_admin on public.content_annotations;

-- baca: semua pengguna terautentikasi; tulis: admin
create policy annotations_read on public.content_annotations
  for select to authenticated using (true);
create policy annotations_admin on public.content_annotations
  for all using (public.my_role() = 'admin')
  with check (public.my_role() = 'admin');

-- Part C — bucket publik 'assets' untuk unggah .glb / .mind --------
insert into storage.buckets (id, name, public, file_size_limit)
values ('assets', 'assets', true, 52428800)
on conflict (id) do update set public = true, file_size_limit = 52428800;

drop policy if exists assets_public_read on storage.objects;
drop policy if exists assets_admin_insert on storage.objects;
drop policy if exists assets_admin_update on storage.objects;
drop policy if exists assets_admin_delete on storage.objects;

-- baca publik (bucket publik → viewer statis & ModelViewer memuat via URL)
create policy assets_public_read on storage.objects
  for select using (bucket_id = 'assets');
-- tulis hanya admin
create policy assets_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'assets' and public.my_role() = 'admin');
create policy assets_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'assets' and public.my_role() = 'admin');
create policy assets_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'assets' and public.my_role() = 'admin');
