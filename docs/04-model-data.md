# 04 - Model Data

Basis data: **Postgres (Supabase)** dengan **Row-Level Security (RLS)**. `pgvector` untuk RAG. Berikut entitas utama dan relasinya (skema awal, bisa berkembang).

## Entitas Inti

### Identitas & Kelas

- **profiles** - perluasan `auth.users`: `id`, `role` (`student` | `teacher` | `admin`), `nama`, `school_id?`, `created_at`.
- **schools** *(opsional)* - `id`, `nama`, `alamat`.
- **classes** - `id`, `teacher_id → profiles`, `nama`, `tahun_ajaran`, `join_code`.
- **enrollments** - `class_id → classes`, `student_id → profiles`, `joined_at` (PK gabungan).

### Konten Master (Farmakognosi)

> Bagian ini mencerminkan skema **as-built** (`supabase/schema.sql` + `supabase/migrations/`). Beberapa entitas lain di dokumen ini masih rancangan/fase lanjut.

- **plants** (tanaman/simplisia nabati) - `id`, `nama_lokal`, `nama_latin`, `familia`, `bagian_digunakan`, `nama_simplisia`, `kandungan` (`text[]`), `khasiat`, `makroskopik`, `mikroskopik`, `model_3d_url`, `ar_target_url` (aset `.mind`), `ar_intro` (paragraf overlay AR).
- **lab_tools** - `id`, `nama`, `fungsi`, `cara_pakai`, `keselamatan`, `model_3d_url`, `ar_target_url`, `ar_intro`. *(Alat kini juga bisa dipindai.)*
- **library_items** - `id`, `judul`, `tipe` (`Modul`|`Artikel`|`Buku`), `penulis`, `ringkasan`, `konten` (`text[]`), `offline` (bool).
- **content_annotations** - titik highlight pada model 3D: `id`, `subject_type` (`plant`|`tool`), `subject_id`, `urutan`, `part_key`, `label`, `pos_{x,y,z}` (titik), `label_{x,y,z}` (offset label), `body` (`text[]`). Dirender oleh `viewer.html`, dikelola di panel admin (`/admin/{tanaman,alat}/[id]/titik`).
- **Storage** - bucket publik `assets` (folder `models/`, `ar-targets/`) untuk unggahan `.glb`/`.mind`; baca publik, tulis dibatasi admin (kebijakan `storage.objects`). Menggantikan `ar_cards`/`thumbnail_url` pada rancangan awal.

### Simulasi Lab

- **lab_simulations** - `id`, `judul`, `deskripsi`, `topik`, `thumbnail_url`.
- **lab_simulation_steps** - `id`, `simulation_id → lab_simulations`, `urutan`, `expected_card_id → ar_cards`, `instruksi`, `feedback_benar`, `feedback_salah`, `animation_ref?`.
- **lab_progress** - `id`, `student_id`, `simulation_id`, `status` (`not_started`|`in_progress`|`completed`), `langkah_terakhir`, `updated_at`.

### Library & RAG

- **library_items** - `id`, `judul`, `tipe` (`buku`|`artikel`|`modul`), `penulis`, `file_url`, `konten_teks`, `tags`, `published_at`.
- **library_chunks** - `id`, `item_id → library_items`, `konten`, `embedding vector`, `metadata` (jsonb). *(Indeks pgvector untuk pencarian kemiripan.)*

### Kuis & Penugasan

- **quizzes** - `id`, `judul`, `topik`, `sumber` (`manual`|`generated`), `created_by → profiles`, `is_published`.
- **questions** - `id`, `quiz_id → quizzes`, `tipe` (`mcq`|`true_false`|`essay`), `pertanyaan`, `opsi` (jsonb), `kunci`, `pembahasan`.
- **assignments** - `id`, `class_id → classes`, `quiz_id → quizzes`, `judul`, `deadline`, `created_at`.
- **submissions** - `id`, `assignment_id → assignments`, `student_id → profiles`, `jawaban` (jsonb), `skor`, `status` (`assigned`|`submitted`|`graded`), `submitted_at`.
- **quiz_attempts** - `id`, `quiz_id`, `student_id`, `skor`, `detail` (jsonb), `created_at` *(untuk latihan mandiri di luar penugasan)*.

### Tutor AI

- **chat_conversations** - `id`, `student_id → profiles`, `judul`, `created_at`.
- **chat_messages** - `id`, `conversation_id → chat_conversations`, `role` (`user`|`assistant`), `konten`, `sources` (jsonb, referensi chunk), `created_at`.

### Progres & Gamifikasi *(opsional, fase lanjut)*

- **activity_events** - `id`, `student_id`, `tipe` (`ar_view`|`sim_step`|`quiz`|`chat`|`library_read`), `ref_id`, `created_at` *(sumber data analitik dashboard)*.
- **points / badges / streaks** - struktur gamifikasi.

## Relasi (ringkas)

```
profiles ──< enrollments >── classes ──< assignments >── quizzes ──< questions
   │                            │                          
   ├──< submissions >───────────┘                          
   ├──< quiz_attempts                                       
   ├──< chat_conversations ──< chat_messages                
   ├──< lab_progress >── lab_simulations ──< lab_simulation_steps ── ar_cards
   └──< activity_events

plants / lab_tools ──< ar_cards
library_items ──< library_chunks (pgvector)
```

## Aturan RLS (garis besar)

| Peran | Boleh baca | Boleh tulis |
|---|---|---|
| **student** | Profil sendiri; kelas yang diikuti; konten master (plants/tools/library/simulations); tugas kelasnya; submission/attempt/chat **milik sendiri** | Submission/attempt/chat/lab_progress milik sendiri |
| **teacher** | Kelas yang diampu + siswa di dalamnya; submission & (untuk keamanan) chat siswa di kelasnya; konten master | Kelas, assignment, quiz/question, penilaian submission |
| **admin** | Semua | Konten master, akun, konfigurasi |

**Catatan privasi**: pengguna adalah anak di bawah umur. Simpan data pribadi seminimal mungkin, batasi akses percakapan tutor hanya untuk guru pengampu & admin, dan pertimbangkan retensi/penghapusan data sesuai kebijakan sekolah.
