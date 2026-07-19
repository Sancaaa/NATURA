# Isian Lampiran 5: Surat Pernyataan LIDM VII Tahun 2026

Berikut adalah rancangan teks untuk mengisi bagian-bagian yang kosong pada file `Lampiran 5.docx` berdasarkan analisis arsitektur proyek NATURA (hasil `GRAPH_REPORT.md` dan dokumentasi terkait).

---

## 1. PERNYATAAN PENGEMBANGAN KARYA

*(Jika NATURA adalah karya inovasi baru dan belum pernah diikutkan dalam perlombaan sebelumnya, lakukan penyesuaian berikut)*

- **Sebelumnya**: Coret kata **~~sudah*~~** (sehingga dibaca: "Sebelumnya **tidak** pernah meraih penghargaan...")
- **Tahun ini**: Coret kata **~~sedang*~~** (sehingga dibaca: "Tahun ini **tidak** diikutsertakan dalam pada kompetisi...")
- **Tabel Pengembangan (Aspek/Komponen)**: Dapat dikosongkan, dicoret, atau diberi keterangan **"-"** / **"Karya Baru (Tidak Relevan)"**.

*(Catatan: Jika NATURA memang merupakan pengembangan dari versi sebelumnya, silakan jabarkan komponen apa saja yang diperbarui pada tabel tersebut, misalnya pembaruan UI/UX, transisi dari web biasa ke Progressive Web App (PWA), atau penambahan fitur RAG).*

---

## 2. PERNYATAAN TRANSPARANSI PENGGUNAAN KECERDASAN ARTIFICIAL

Berdasarkan arsitektur yang dijelaskan di `README.md` dan struktur *codebase*, NATURA secara fungsional menggunakan asisten AI untuk operasionalnya. Berikut adalah isian yang sesuai untuk tabel transparansi:

### Tabel 1: Fungsionalitas Operasional Perangkat (Integrasi API AI)

| No. | Nama Aplikasi AI/API | Fungsi yang Didukung dalam Inovasi | Kustomisasi |
|---|---|---|---|
| 1 | **Google Gemini Flash API** | Mendukung fitur "Tutor AI" interaktif dan pembuatan "Kuis Generatif" otomatis untuk evaluasi siswa pada materi Farmakognosi. | Merancang arsitektur integrasi mandiri berbasis RAG (*Retrieval-Augmented Generation*). Penyiapan basis vektor dengan `pgvector` (Supabase), serta *prompt engineering* kustom agar AI mematuhi persona spesifik sebagai asisten Farmakognosi tanpa halusinasi. |

*(Anda dapat menambahkan baris baru jika inovasi Anda menggunakan API pihak ketiga lainnya seperti penyedia 3D AR, namun tabel di atas sudah cukup merepresentasikan unsur AI-nya).*

### Tabel 2: Deteksi AI pada Naskah Dokumen (Proposal/Laporan)

Untuk bagian ini, Anda wajib melakukan pengecekan dokumen naskah proposal Anda menggunakan alat deteksi AI dan mengisi persentasenya. Berikut adalah contoh cara mengisinya:

- Menggunakan aplikasi deteksi KA/AI: **[Isi dengan alat yang dipakai, misal: Turnitin / ZeroGPT]**
- Memberikan hasil deteksi tingkat validasi KA/AI sebesar: **[Isi dengan hasil %, misal: 10] %**

**Tabel Penjelasan dan Argumentasi terhadap Bagian yang Terdeteksi Menggunakan KA/AI:**

| No. | Penjelasan dan Argumentasi terhadap Bagian yang Terdeteksi Menggunakan KA/AI |
|---|---|
| 1 | **Bagian Pendahuluan dan Tinjauan Pustaka**: Penggunaan *Generative AI* (seperti ChatGPT/Claude) pada bagian ini murni difungsikan sebatas alat bantu (*proofreading*) untuk mengecek ejaan, memparafrase kalimat, serta menyempurnakan struktur tata bahasa agar lebih baku dan akademis. Ide utama, rumusan masalah, dan solusi murni gagasan orisinal tim. |
| 2 | **Bagian Desain Sistem & Rekayasa Perangkat Lunak**: Beberapa referensi teknis dan struktur analisis *codebase* dihasilkan dengan bantuan asisten koding dan *tool* analisis (*Graphify*). Namun, logika sistem, arsitektur (*Next.js + Supabase + WebAR*), serta skenario pengguna (*UX*) seluruhnya dirancang dan diputuskan secara mandiri oleh tim pengembang. |

---
**Instruksi Selanjutnya:**
Silakan salin (*copy*) isian tabel di atas dan sesuaikan bagian yang bertanda kurung siku tebal `[...]` ke dalam dokumen `Lampiran 5.docx` Anda.
