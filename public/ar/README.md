# Target AR (.mind)

Mode AR (kamera) memakai **MindAR** dengan *image target*. Kartu AR harus
dikompilasi menjadi berkas `.mind`.

**Unggah:** setelah dikompilasi, unggah `.mind` lewat panel admin (Tanaman/Alat →
form) — tersimpan ke Supabase Storage (`assets/ar-targets/`) dan tautannya
dipakai otomatis oleh `viewer.html`. Alat kini juga bisa punya target AR.

## Cara membuat `targets.mind`

1. Buka MindAR Image Target Compiler:
   https://hiukim.github.io/mind-ar-js-doc/tools/compile
2. Unggah gambar kartu (gambar unik, kontras tinggi, banyak detail/fitur).
3. Unduh hasilnya sebagai `targets.mind` dan taruh di folder ini
   (`public/ar/targets.mind`).
4. Untuk banyak kartu, kompilasi beberapa gambar sekaligus; `targetIndex`
   pada scene mengikuti urutan gambar.

## Aset yang dibutuhkan

- `public/ar/targets.mind` — target gambar kartu.
- `public/models/plant.glb` — model 3D yang muncul di atas kartu.

Sebelum kedua berkas ada, mode AR tetap membuka kamera & UI pemindaian,
tetapi model belum muncul. Gunakan tombol **Lihat 3D** untuk demo tanpa aset.
