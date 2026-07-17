# Graph Report - Natura  (2026-07-17)

## Corpus Check
- 123 files · ~174,750 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 572 nodes · 1169 edges · 34 communities (26 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.61)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `616e58ac`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- classroom.ts
- cn
- compilerOptions
- devDependencies
- createClient
- page.tsx
- Button.tsx
- dependencies
- classroom.ts
- quizzes.ts
- page.tsx
- manifest.json
- middleware.ts
- layout.tsx
- route.ts
- ARScene.tsx
- next.config.mjs
- postcss.config.mjs
- 01 — Kebutuhan Produk (PRD)
- Panduan Hosting & Deployment NATURA
- Backend Supabase (Self-Host) — Fase 1
- 03 — Desain Sistem & UX
- 05 — Roadmap
- Panduan Git & Alur Kerja (Workflow)
- NATURA
- AnnotationPicker.tsx
- Target AR (.mind)
- 20260713120000_admin_ar_upload.sql
- 20260713130000_ar_intro.sql
- README.md

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 56 edges
2. `buttonClass()` - 27 edges
3. `cn()` - 23 edges
4. `Card()` - 21 edges
5. `Badge()` - 17 edges
6. `compilerOptions` - 16 edges
7. `Button()` - 12 edges
8. `requireAdmin()` - 11 edges
9. `getPlantDb()` - 11 edges
10. `getToolDb()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Profil()` --calls--> `getCurrentProfile`  [EXTRACTED]
  app/(student)/profil/page.tsx → lib/auth.ts
- `GET()` --calls--> `createClient()`  [EXTRACTED]
  app/keluar/route.ts → lib/supabase/server.ts
- `AdminPage()` --calls--> `getCurrentProfile`  [EXTRACTED]
  app/(admin)/admin/page.tsx → lib/auth.ts
- `PustakaEdit()` --calls--> `getLibraryItemDb()`  [EXTRACTED]
  app/(admin)/admin/pustaka/[id]/page.tsx → lib/db/library.ts
- `AdminPustaka()` --calls--> `buttonClass()`  [EXTRACTED]
  app/(admin)/admin/pustaka/page.tsx → components/ui/Button.tsx

## Import Cycles
- None detected.

## Communities (34 total, 8 thin omitted)

### Community 0 - "classroom.ts"
Cohesion: 0.06
Nodes (41): PustakaEdit(), AdminPustaka(), Beranda(), KuisList(), Read(), Library(), Profil(), Dashboard() (+33 more)

### Community 1 - "cn"
Cohesion: 0.12
Nodes (20): AdminLayout(), Home(), StudentLayout(), Msg, suggestions, Tutor(), TeacherLayout(), AdminNav() (+12 more)

### Community 2 - "compilerOptions"
Cohesion: 0.07
Nodes (28): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 3 - "devDependencies"
Cohesion: 0.04
Nodes (46): clsx, lucide-react, next, dependencies, clsx, lucide-react, next, react (+38 more)

### Community 4 - "createClient"
Cohesion: 0.09
Nodes (21): AdminPage(), roleLabel, GET(), CreateUserForm(), DeleteUserButton(), RoleSelect(), TextField(), createUser() (+13 more)

### Community 5 - "page.tsx"
Cohesion: 0.06
Nodes (43): AlatEdit(), AlatTitik(), AdminAlat(), TanamanEdit(), TanamanTitik(), AdminTanaman(), GET(), Detail() (+35 more)

### Community 6 - "Button.tsx"
Cohesion: 0.07
Nodes (38): Page(), Page(), BankSoal(), JoinClassForm(), QuizRunner(), AssignmentForm(), CreateClassForm(), DeleteAssignmentButton() (+30 more)

### Community 7 - "dependencies"
Cohesion: 0.13
Nodes (32): empty, FileUploadField(), Field(), TextArea(), TextInput(), LibraryForm(), ToolForm(), Size (+24 more)

### Community 8 - "classroom.ts"
Cohesion: 0.19
Nodes (20): on_auth_user_created, public.assignments, public.classes, public.content_annotations, public.current_profile(), public.enrolled_in(), public.enrollments, public.handle_new_user() (+12 more)

### Community 9 - "quizzes.ts"
Cohesion: 0.20
Nodes (19): on_auth_user_created, public.assignments, public.classes, public.current_profile(), public.enrolled_in(), public.enrollments, public.handle_new_user(), public.join_class_by_code() (+11 more)

### Community 10 - "page.tsx"
Cohesion: 0.21
Nodes (18): on_auth_user_created, public.assignments, public.classes, public.enrolled_in(), public.enrollments, public.handle_new_user(), public.join_class_by_code(), public.lab_tools (+10 more)

### Community 11 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 12 - "middleware.ts"
Cohesion: 0.17
Nodes (12): 02 — Tech Stack & Arsitektur, AR: Pendekatan & Alasan, Arsitektur Sistem, Batasan Infrastruktur (menentukan banyak keputusan), Deployment & Operasional (self-host), Keamanan & Privasi Data (pengguna anak di bawah umur), LLM: Tutor & Pembuatan Kuis (Gemini Flash), Offline / PWA (+4 more)

### Community 16 - "ARScene.tsx"
Cohesion: 0.18
Nodes (11): 04 — Model Data, Aturan RLS (garis besar), Entitas Inti, Identitas & Kelas, Konten Master (Farmakognosi), Kuis & Penugasan, Library & RAG, Progres & Gamifikasi *(opsional, fase lanjut)* (+3 more)

### Community 20 - "01 — Kebutuhan Produk (PRD)"
Cohesion: 0.20
Nodes (10): 01 — Kebutuhan Produk (PRD), Daftar Fitur (dirapikan & diperluas dari ide awal), Di Luar Lingkup (untuk sekarang), Kebutuhan Fungsional (ringkas), Kebutuhan Non-Fungsional, Konteks Kurikulum (Farmakognosi SMK Farmasi), Persona, Sisi Guru (desktop) (+2 more)

### Community 21 - "Panduan Hosting & Deployment NATURA"
Cohesion: 0.20
Nodes (9): 1. Kebutuhan Sistem (Prasyarat), 2. Deployment Database (Supabase Self-Hosted), 3. Deployment Aplikasi Web (Next.js), 4. Konfigurasi Domain dan HTTPS (Caddy), A. Persiapan Aplikasi, A. Server Database (On-Premise), B. Menjalankan dengan PM2, B. Server Frontend (VPS Publik) (+1 more)

### Community 22 - "Backend Supabase (Self-Host) — Fase 1"
Cohesion: 0.22
Nodes (8): Backend Supabase (Self-Host) — Fase 1, Cara menjalankan, Catatan, Isi folder, Opsi A — Cepat untuk pengembangan (Supabase CLI), Opsi B — Self-host produksi (on-premise/VPS), Sambungkan ke aplikasi, Terapkan skema & data

### Community 23 - "03 — Desain Sistem & UX"
Cohesion: 0.25
Nodes (8): 03 — Desain Sistem & UX, Aksesibilitas, Design Tokens, Pedoman Aset 3D, Prinsip Desain, State UX untuk AR (wajib dirancang eksplisit), UX Guru (desktop), UX Siswa (mobile)

### Community 24 - "05 — Roadmap"
Cohesion: 0.25
Nodes (8): 05 — Roadmap, Definisi "Selesai", Fase 0 — Mockup Fungsional (untuk Video Dokumentasi) ⭐ prioritas awal, Fase 1 — Backend Nyata + MVP, Fase 2 — Tutor AI + Kuis Generatif + RAG, Fase 3 — Simulasi Lab Multi-Kartu, Fase 4 — Polish & Skala, Risiko & Mitigasi

### Community 26 - "Panduan Git & Alur Kerja (Workflow)"
Cohesion: 0.33
Nodes (5): 1. Strategi Percabangan (Branching Strategy), 2. Aturan Penulisan Commit (Conventional Commits), 3. Alur Kerja Harian (Daily Workflow), 4. Mengatasi Konflik (Merge Conflict), Panduan Git & Alur Kerja (Workflow)

### Community 27 - "NATURA"
Cohesion: 0.33
Nodes (6): Fase 1 — Mengaktifkan Backend (opsional), Menjalankan Mockup (Fase 0), NATURA, Peta Dokumen, Ringkasan Konsep, Status

### Community 29 - "Target AR (.mind)"
Cohesion: 0.50
Nodes (3): Aset yang dibutuhkan, Cara membuat `targets.mind`, Target AR (.mind)

## Knowledge Gaps
- **175 isolated node(s):** `roleLabel`, `Msg`, `suggestions`, `metadata`, `viewport` (+170 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `dependencies` to `classroom.ts`, `cn`, `createClient`, `page.tsx`, `Button.tsx`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `classroom.ts`, `page.tsx`, `Button.tsx`, `dependencies`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `buttonClass()` connect `page.tsx` to `classroom.ts`, `cn`, `createClient`, `Button.tsx`, `dependencies`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `roleLabel`, `Msg`, `suggestions` to the rest of the system?**
  _175 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `classroom.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0649692712906058 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.11693548387096774 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._