# Model 3D (GLB)

**Cara termudah:** unggah `.glb` lewat panel admin (Tanaman/Alat → form) - berkas
masuk ke Supabase Storage (bucket publik `assets/models/`) dan URL-nya otomatis
tersimpan di DB.

Alternatif statis: taruh `.glb` di folder ini lalu rujuk lewat `model3dUrl`
(mis. `/models/kunyit.glb`).

- Format: glTF Binary (`.glb`), sebaiknya dikompresi **Draco**.
- Ukuran disarankan < 2–5 MB per aset agar ringan di HP.
- Jika model belum ada, viewer "Lihat 3D" otomatis menampilkan model tanaman
  prosedural sederhana sebagai pengganti.

Nama file default yang dicari mode AR: `plant.glb`.
