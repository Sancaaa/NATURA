-- ============================================================
-- NATURA — Guru boleh mengelola modul materi miliknya sendiri.
-- Meniru pola kepemilikan pada `quizzes`: tulis = pemilik atau admin.
-- Modul lama (created_by NULL) tetap hanya bisa diubah admin.
-- Idempoten.
-- ============================================================
alter table public.library_items
  add column if not exists created_by uuid references public.profiles (id) on delete set null;

create index if not exists library_items_created_by_idx
  on public.library_items (created_by);

-- Ganti policy admin-only dengan policy berbasis kepemilikan.
drop policy if exists library_admin on public.library_items;
drop policy if exists library_write on public.library_items;
create policy library_write on public.library_items for all
  using (created_by = auth.uid() or public.my_role() = 'admin')
  with check (created_by = auth.uid() or public.my_role() = 'admin');
