-- ============================================================
-- NATURA — Skema Database (Fase 1)
-- Jalankan di SQL Editor Supabase (self-host) atau via psql.
-- Mencakup: profil & peran, konten master, kelas, penugasan.
-- (RAG/pgvector & chat tutor menyusul di Fase 2.)
-- ============================================================

create extension if not exists pgcrypto;

-- Peran pengguna -------------------------------------------------
do $$ begin
  create type public.user_role as enum ('student', 'teacher', 'admin');
exception when duplicate_object then null; end $$;

-- Profil (perluasan auth.users) ---------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'student',
  nama text not null default '',
  created_at timestamptz not null default now()
);

-- Konten master -------------------------------------------------
create table if not exists public.plants (
  id text primary key,
  nama_lokal text not null,
  nama_latin text not null,
  familia text,
  bagian_digunakan text,
  nama_simplisia text,
  kandungan text[] not null default '{}',
  khasiat text,
  makroskopik text,
  mikroskopik text,
  model_3d_url text,
  ar_target_url text
);

create table if not exists public.lab_tools (
  id text primary key,
  nama text not null,
  fungsi text,
  cara_pakai text,
  keselamatan text,
  model_3d_url text
);

create table if not exists public.library_items (
  id text primary key,
  judul text not null,
  tipe text not null,
  penulis text,
  ringkasan text,
  konten text[] not null default '{}',
  offline boolean not null default false
);

create table if not exists public.quizzes (
  id text primary key,
  judul text not null,
  topik text,
  sumber text not null default 'Latihan Mandiri',
  created_by uuid references public.profiles (id) on delete set null,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id text not null references public.quizzes (id) on delete cascade,
  urutan int not null default 0,
  pertanyaan text not null,
  opsi jsonb not null,
  kunci int not null,
  pembahasan text
);

-- Kelas ---------------------------------------------------------
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  nama text not null,
  tahun_ajaran text,
  join_code text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  class_id uuid not null references public.classes (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (class_id, student_id)
);

-- Penugasan & pengumpulan --------------------------------------
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  quiz_id text not null references public.quizzes (id),
  judul text not null,
  deadline timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  jawaban jsonb,
  skor int,
  status text not null default 'assigned',
  submitted_at timestamptz,
  unique (assignment_id, student_id)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id text not null references public.quizzes (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  skor int not null,
  detail jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Trigger: buat profil otomatis saat user baru mendaftar
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nama, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nama', ''),
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'student')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ============================================================
-- Fungsi bantu (SECURITY DEFINER) agar policy tidak rekursif
-- ============================================================
create or replace function public.my_role()
returns public.user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.teaches_class(cid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.classes where id = cid and teacher_id = auth.uid());
$$;

create or replace function public.enrolled_in(cid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.enrollments where class_id = cid and student_id = auth.uid());
$$;

create or replace function public.teaches_student(sid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.enrollments e
    join public.classes c on c.id = e.class_id
    where e.student_id = sid and c.teacher_id = auth.uid()
  );
$$;

-- Gabung kelas via kode (definer: agar siswa bisa mencari kode
-- meski belum terdaftar / RLS classes membatasi SELECT).
create or replace function public.join_class_by_code(p_code text)
returns uuid language plpgsql security definer set search_path = public as $$
declare cid uuid;
begin
  select id into cid from public.classes where join_code = p_code;
  if cid is null then return null; end if;
  insert into public.enrollments (class_id, student_id)
  values (cid, auth.uid())
  on conflict do nothing;
  return cid;
end;
$$;

-- ============================================================
-- Row-Level Security
-- ============================================================
alter table public.profiles       enable row level security;
alter table public.plants         enable row level security;
alter table public.lab_tools      enable row level security;
alter table public.library_items  enable row level security;
alter table public.quizzes        enable row level security;
alter table public.questions      enable row level security;
alter table public.classes        enable row level security;
alter table public.enrollments    enable row level security;
alter table public.assignments    enable row level security;
alter table public.submissions    enable row level security;
alter table public.quiz_attempts  enable row level security;

-- profiles: baca diri sendiri / siswa yang diampu / admin; ubah diri sendiri
create policy profiles_select on public.profiles for select using (
  id = auth.uid() or public.my_role() = 'admin' or public.teaches_student(id)
);
create policy profiles_update on public.profiles for update using (id = auth.uid());

-- konten master: dapat dibaca semua pengguna terautentikasi; tulis = admin
create policy plants_read on public.plants for select to authenticated using (true);
create policy tools_read on public.lab_tools for select to authenticated using (true);
create policy library_read on public.library_items for select to authenticated using (true);
create policy plants_admin on public.plants for all using (public.my_role() = 'admin') with check (public.my_role() = 'admin');
create policy tools_admin on public.lab_tools for all using (public.my_role() = 'admin') with check (public.my_role() = 'admin');
create policy library_admin on public.library_items for all using (public.my_role() = 'admin') with check (public.my_role() = 'admin');

-- quizzes/questions: baca terautentikasi; tulis = pembuat (guru) atau admin
create policy quizzes_read on public.quizzes for select to authenticated using (true);
create policy quizzes_write on public.quizzes for all
  using (created_by = auth.uid() or public.my_role() = 'admin')
  with check (created_by = auth.uid() or public.my_role() = 'admin');
create policy questions_read on public.questions for select to authenticated using (true);
create policy questions_write on public.questions for all
  using (exists (select 1 from public.quizzes q where q.id = quiz_id and (q.created_by = auth.uid() or public.my_role() = 'admin')))
  with check (exists (select 1 from public.quizzes q where q.id = quiz_id and (q.created_by = auth.uid() or public.my_role() = 'admin')));

-- classes: guru pemilik / siswa terdaftar / admin
create policy classes_select on public.classes for select using (
  teacher_id = auth.uid() or public.enrolled_in(id) or public.my_role() = 'admin'
);
create policy classes_insert on public.classes for insert with check (
  teacher_id = auth.uid() and public.my_role() in ('teacher', 'admin')
);
create policy classes_modify on public.classes for update using (teacher_id = auth.uid());
create policy classes_delete on public.classes for delete using (teacher_id = auth.uid());

-- enrollments: siswa sendiri / guru kelas / admin
create policy enrollments_select on public.enrollments for select using (
  student_id = auth.uid() or public.teaches_class(class_id) or public.my_role() = 'admin'
);
create policy enrollments_insert on public.enrollments for insert with check (
  student_id = auth.uid() or public.teaches_class(class_id)
);
create policy enrollments_delete on public.enrollments for delete using (
  student_id = auth.uid() or public.teaches_class(class_id)
);

-- assignments: guru kelas / siswa terdaftar / admin
create policy assignments_select on public.assignments for select using (
  public.teaches_class(class_id) or public.enrolled_in(class_id) or public.my_role() = 'admin'
);
create policy assignments_write on public.assignments for all
  using (public.teaches_class(class_id))
  with check (public.teaches_class(class_id));

-- submissions: siswa pemilik / guru kelas terkait / admin
create policy submissions_select on public.submissions for select using (
  student_id = auth.uid()
  or public.my_role() = 'admin'
  or exists (
    select 1 from public.assignments a
    where a.id = assignment_id and public.teaches_class(a.class_id)
  )
);
create policy submissions_upsert on public.submissions for insert with check (student_id = auth.uid());
create policy submissions_update_self on public.submissions for update using (student_id = auth.uid());
create policy submissions_grade on public.submissions for update using (
  exists (select 1 from public.assignments a where a.id = assignment_id and public.teaches_class(a.class_id))
);

-- quiz_attempts: milik sendiri / guru yang mengampu siswa
create policy attempts_select on public.quiz_attempts for select using (
  student_id = auth.uid() or public.teaches_student(student_id) or public.my_role() = 'admin'
);
create policy attempts_insert on public.quiz_attempts for insert with check (student_id = auth.uid());
