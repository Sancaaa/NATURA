# Graph Report - .  (2026-07-18)

## Corpus Check
- 230 files · ~249,087 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 775 nodes · 1418 edges · 80 communities (31 shown, 49 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.73)
- Token cost: 85,247 input · 2,648 output

## Community Hubs (Navigation)
- Komponen UI & Admin Konten
- Kartu UI & Halaman
- Sistem Kuis
- Konten AR & Anotasi
- Kelas & Tugas Siswa
- Dependensi Proyek
- Mesin Praktikum
- Auth & Admin
- Kelas & Kuis Harian
- Layout & Navigasi
- Konfigurasi TypeScript
- Skema Database
- Snippet SQL
- Migrasi Awal DB
- Panduan Referensi Postgres
- Skrip Seed Demo
- Dokumentasi Proyek
- Seksi Skill Postgres
- Manifest PWA
- Referensi AR & UI
- Umpan Balik Skill
- Changelog Skill v0.1
- Changelog Skill v1
- Data Kelas (mock)
- Root Layout & Font
- Pemilih Anotasi 3D
- Stub Route API
- Migrasi Unggah AR
- Migrasi Intro AR
- Migrasi Menu Natu
- Migrasi Gambar Preview
- Skill Supabase
- Full Text Search
- Jsonb Indexing
- Idle Timeout
- Limits
- Pooling
- Prepared Statements
- Batch Inserts
- N Plus One
- Pagination
- Upsert
- Advisory
- Deadlock Prevention
- Short Transactions
- Skip Locked
- Explain Analyze
- Pg Stat Statements
- Vacuum Analyze
- Composite Indexes
- Covering Indexes
- Index Types
- Missing Indexes
- Partial Indexes
- Constraints
- Data Types
- Foreign Key Indexes
- Lowercase Identifiers
- Partitioning
- Primary Keys
- Privileges
- Rls Basics
- Rls Performance
- Template Aturan Postgres
- Skrip Deploy
- Klien Supabase
- Next Config
- Config PostCSS
- Tabel Library Items
- Panduan Git
- README Target AR
- UI NatuBot
- UI NatuLearn
- Dashboard Guru NatuTeach

## God Nodes (most connected - your core abstractions)
1. `buttonClass()` - 36 edges
2. `Card()` - 32 edges
3. `compilerOptions` - 16 edges
4. `Button()` - 16 edges
5. `getPlantDb()` - 12 edges
6. `getToolDb()` - 12 edges
7. `parseAttachments()` - 11 edges
8. `getStudentAssignments()` - 11 edges
9. `revalidateContent()` - 10 edges
10. `createPlant()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `NatuLab UI Reference` --conceptually_related_to--> `AR Viewer Page`  [INFERRED]
  refUI/NatuLab.png → public/ar/viewer.html
- `Login Screen UI` --references--> `Supabase Backend Documentation`  [INFERRED]
  refUI/Login.png → supabase/README.md
- `StudentLayout()` --calls--> `requireRole()`  [EXTRACTED]
  app/(student)/layout.tsx → lib/auth.ts
- `BankSoal()` --calls--> `buttonClass()`  [EXTRACTED]
  app/(teacher)/bank-soal/page.tsx → components/ui/Button.tsx
- `KelasList()` --calls--> `getTeacherClasses()`  [EXTRACTED]
  app/(teacher)/kelas/page.tsx → lib/db/classroom.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **NATURA Documentation Suite** - docs_01_kebutuhan_produk, docs_02_tech_stack, docs_03_desain_sistem, docs_04_model_data, docs_05_roadmap [EXTRACTED 1.00]
- **AR Implementation Flow** - ar_codingar, ar_arcard_samiloto_png, public_ar_readme, ar_technology [INFERRED 0.85]
- **Natura Educational Platform** - refui_natulab, refui_natulearn, refui_natubot, refui_natuteach_home [EXTRACTED 1.00]
- **AR Visualization Pipeline** - public_ar_viewer, public_models_readme, public_ar_samiloto_card, api_ar_data [EXTRACTED 0.95]

## Communities (80 total, 49 thin omitted)

### Community 0 - "Komponen UI & Admin Konten"
Cohesion: 0.07
Nodes (51): AlatEdit(), PustakaEdit(), BacaModul(), ModulEdit(), empty, actions, Kind, FileUploadField() (+43 more)

### Community 1 - "Kartu UI & Halaman"
Cohesion: 0.09
Nodes (30): AdminAlat(), roleLabel, AdminPustaka(), AdminTanaman(), Beranda(), shortcuts, VisualisasiAlat(), NatuLab() (+22 more)

### Community 2 - "Sistem Kuis"
Cohesion: 0.07
Nodes (32): Page(), BankSoal(), DeleteQuizButton(), EditQuizForm(), QuizDraftEditor(), Badge(), Tone, ProgressBar() (+24 more)

### Community 3 - "Konten AR & Anotasi"
Cohesion: 0.09
Nodes (32): AlatTitik(), TanamanEdit(), TanamanTitik(), GET(), DetailAlat(), DetailTanaman(), PindaiResolver(), AnnotationPicker (+24 more)

### Community 4 - "Kelas & Tugas Siswa"
Cohesion: 0.08
Nodes (35): NatuLearn(), DetailTugas(), DaftarTugas(), Dashboard(), KelasDetail(), KelasList(), SiswaDetail(), DaftarSiswa() (+27 more)

### Community 5 - "Dependensi Proyek"
Cohesion: 0.04
Nodes (46): clsx, lucide-react, next, dependencies, clsx, lucide-react, next, react (+38 more)

### Community 6 - "Mesin Praktikum"
Cohesion: 0.11
Nodes (22): PraktikumRunner(), STEP_REGISTRY, DragDropStep(), InfoStep(), Model3DStep(), ObserveStep(), SliderRevealStep(), Stage (+14 more)

### Community 7 - "Auth & Admin"
Cohesion: 0.08
Nodes (23): StudentLayout(), CreateUserForm(), DeleteUserButton(), RoleSelect(), BottomNav(), items, createUser(), deleteUser() (+15 more)

### Community 8 - "Kelas & Kuis Harian"
Cohesion: 0.09
Nodes (23): KuisHarian(), JoinClassForm(), instruksi, QuizIntro(), QuizRunner(), AssignmentForm(), CreateClassForm(), DeleteAssignmentButton() (+15 more)

### Community 9 - "Layout & Navigasi"
Cohesion: 0.10
Nodes (11): Msg, suggestions, AdminNav(), tabs, AppHeader(), items, Sidebar(), GoogleMark() (+3 more)

### Community 10 - "Konfigurasi TypeScript"
Cohesion: 0.07
Nodes (28): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 11 - "Skema Database"
Cohesion: 0.19
Nodes (20): on_auth_user_created, public.assignments, public.classes, public.content_annotations, public.current_profile(), public.enrolled_in(), public.enrollments, public.handle_new_user() (+12 more)

### Community 12 - "Snippet SQL"
Cohesion: 0.20
Nodes (19): on_auth_user_created, public.assignments, public.classes, public.current_profile(), public.enrolled_in(), public.enrollments, public.handle_new_user(), public.join_class_by_code() (+11 more)

### Community 13 - "Migrasi Awal DB"
Cohesion: 0.21
Nodes (18): on_auth_user_created, public.assignments, public.classes, public.enrolled_in(), public.enrollments, public.handle_new_user(), public.join_class_by_code(), public.lab_tools (+10 more)

### Community 14 - "Panduan Referensi Postgres"
Cohesion: 0.12
Nodes (15): 1. Concrete Transformation Patterns, 2. Error-First Structure, 3. Quantified Impact, 4. Self-Contained Examples, 5. Semantic Naming, Code Example Standards, Comments, Impact Level Guidelines (+7 more)

### Community 15 - "Skrip Seed Demo"
Cohesion: 0.20
Nodes (12): accounts, BASE, CLASSES, count(), createUser(), del(), env, H (+4 more)

### Community 16 - "Dokumentasi Proyek"
Cohesion: 0.17
Nodes (12): AR Card Samiloto, AR Viewer HTML, WebAR Technology, Kebutuhan Produk (PRD), Tech Stack & Arsitektur, Desain Sistem & UX, Model Data, Roadmap (+4 more)

### Community 17 - "Seksi Skill Postgres"
Cohesion: 0.20
Nodes (9): 1. Query Performance (query), 2. Connection Management (conn), 3. Security & RLS (security), 4. Schema Design (schema), 5. Concurrency & Locking (lock), 6. Data Access Patterns (data), 7. Monitoring & Diagnostics (monitor), 8. Advanced Features (advanced) (+1 more)

### Community 18 - "Manifest PWA"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 19 - "Referensi AR & UI"
Cohesion: 0.25
Nodes (8): AR Data API Endpoint, Samiloto AR Target Card, AR Viewer Page, 3D Models Documentation, Login Screen UI, NatuLab UI Reference, Supabase Backend Documentation, Supabase Assets Bucket

### Community 20 - "Umpan Balik Skill"
Cohesion: 0.29
Nodes (5): Fix suggestion, Source, What happened, Skill Feedback, Steps

### Community 21 - "Changelog Skill v0.1"
Cohesion: 0.48
Nodes (6): [0.1.3](https://github.com/supabase/agent-skills/compare/v0.1.2...v0.1.3) (2026-06-02), [0.1.4](https://github.com/supabase/agent-skills/compare/v0.1.3...v0.1.4) (2026-06-05), [0.1.5](https://github.com/supabase/agent-skills/compare/v0.1.4...v0.1.5) (2026-07-10), Bug Fixes, Changelog, Features

### Community 22 - "Changelog Skill v1"
Cohesion: 0.48
Nodes (6): [1.2.0](https://github.com/supabase/agent-skills/compare/v1.1.1...v1.2.0) (2026-06-02), [1.3.0](https://github.com/supabase/agent-skills/compare/v1.2.0...v1.3.0) (2026-06-05), [1.4.0](https://github.com/supabase/agent-skills/compare/v1.3.0...v1.4.0) (2026-07-10), Bug Fixes, Changelog, Features

### Community 23 - "Data Kelas (mock)"
Cohesion: 0.29
Nodes (3): classes, ClassRoom, Student

### Community 24 - "Root Layout & Font"
Cohesion: 0.40
Nodes (3): jakarta, metadata, viewport

## Knowledge Gaps
- **210 isolated node(s):** `Tone`, `Role`, `Profile`, `Student`, `ClassRoom` (+205 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **49 thin communities (<3 nodes) omitted from report** - run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `buttonClass()` connect `Komponen UI & Admin Konten` to `Kartu UI & Halaman`, `Sistem Kuis`, `Konten AR & Anotasi`, `Kelas & Tugas Siswa`, `Mesin Praktikum`, `Auth & Admin`, `Kelas & Kuis Harian`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `Card()` connect `Kartu UI & Halaman` to `Komponen UI & Admin Konten`, `Sistem Kuis`, `Konten AR & Anotasi`, `Kelas & Tugas Siswa`, `Kelas & Kuis Harian`, `Layout & Navigasi`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `Button()` connect `Mesin Praktikum` to `Kelas & Kuis Harian`, `Layout & Navigasi`, `Sistem Kuis`, `Komponen UI & Admin Konten`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `Tone`, `Role`, `Profile` to the rest of the system?**
  _210 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Komponen UI & Admin Konten` be split into smaller, more focused modules?**
  _Cohesion score 0.06604938271604938 - nodes in this community are weakly interconnected._
- **Should `Kartu UI & Halaman` be split into smaller, more focused modules?**
  _Cohesion score 0.09071117561683599 - nodes in this community are weakly interconnected._
- **Should `Sistem Kuis` be split into smaller, more focused modules?**
  _Cohesion score 0.07482993197278912 - nodes in this community are weakly interconnected._