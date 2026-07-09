# Panduan Git & Alur Kerja (Workflow)

Dokumen ini menjelaskan standar dan alur kerja penggunaan Git untuk pengembangan proyek **NATURA**.

## 1. Strategi Percabangan (Branching Strategy)

Kita menggunakan model percabangan sederhana berbasis *feature branch*:
- **`main`**: Branch utama yang selalu stabil dan siap di-deploy ke server produksi. Jangan pernah melakukan *commit* langsung ke branch ini.
- **`dev`** (opsional): Branch untuk integrasi pengembangan sebelum di-merge ke `main`.
- **`feature/nama-fitur`**: Branch untuk mengembangkan fitur baru (contoh: `feature/ar-scanner`).
- **`fix/nama-bug`**: Branch untuk memperbaiki bug (contoh: `fix/login-error`).

## 2. Aturan Penulisan Commit (Conventional Commits)

Format pesan commit harus deskriptif dan mengikuti konvensi berikut:
`<tipe>(<opsional scope>): <pesan singkat>`

**Tipe yang diizinkan:**
- `feat:` Menambahkan fitur baru.
- `fix:` Memperbaiki bug.
- `docs:` Mengubah dokumentasi (README, folder docs/).
- `style:` Perubahan yang tidak mempengaruhi logika kode (spasi, formatting, titik koma, dll).
- `refactor:` Perubahan kode yang tidak memperbaiki bug atau menambah fitur (restrukturisasi kode).
- `chore:` Perawatan rutin (update dependency, konfigurasi build).

**Contoh:**
- `feat(ar): menambahkan model 3D tanaman jahe`
- `fix(auth): memperbaiki sesi login guru yang kedaluwarsa`
- `docs: memperbarui panduan hosting`

## 3. Alur Kerja Harian (Daily Workflow)

1. **Pastikan repository selalu up-to-date:**
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Buat branch baru untuk pekerjaan Anda:**
   ```bash
   git checkout -b feature/kuis-generatif
   ```
3. **Lakukan perubahan, lalu tambahkan ke staging:**
   ```bash
   git add .
   ```
4. **Buat commit dengan pesan yang jelas:**
   ```bash
   git commit -m "feat(kuis): menambahkan prompt Gemini untuk kuis"
   ```
5. **Push branch Anda ke repository jarak jauh (remote):**
   ```bash
   git push -u origin feature/kuis-generatif
   ```
6. **Buat Pull Request (PR)** dari branch Anda ke `main`. Minta anggota tim lain untuk melakukan *review*.

## 4. Mengatasi Konflik (Merge Conflict)
Jika terjadi konflik saat melakukan pull atau merge, buka file yang konflik di *code editor* (VS Code), selesaikan konflik secara manual dengan memilih kode mana yang ingin dipertahankan, lalu lakukan `git add` dan `git commit` untuk menyelesaikan *merge*.
