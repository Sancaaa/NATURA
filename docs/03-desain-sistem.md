# 03 — Desain Sistem & UX

Dua pengalaman berbeda dalam satu produk:

- **Siswa** → *mobile-first*, dipakai sambil memegang HP dan mengarahkan kamera. Minim teks, banyak visual, tombol besar.
- **Guru** → *desktop-first*, padat data, tabel & grafik, alur kerja efisien.

## Prinsip Desain

1. **Kamera adalah panggung utama** (siswa). UI AR harus tidak menghalangi; kontrol mengambang di tepi, area tengah untuk konten AR.
2. **Satu tugas per layar** untuk siswa; kurangi beban kognitif.
3. **Data yang bisa ditindaklanjuti** untuk guru; tiap angka mengarah ke aksi (lihat detail, tegur, tugaskan ulang).
4. **Ramah device sederhana**: hemat animasi berat, aset teroptimasi, *loading state* yang jelas.
5. **Bahasa Indonesia** sebagai default, nada suportif untuk pelajar.

## Design Tokens

> Nilai berikut adalah **titik awal** yang bisa disetel. Tema botani ("Natura") memakai hijau alami + *earth tone*, tetapi area data (dashboard) tetap netral agar terbaca.

**Warna (light):**

| Token | Contoh | Pemakaian |
|---|---|---|
| `primary` | hijau daun `#2E7D4F` | aksi utama, brand |
| `primary-dark` | `#1B5E3A` | hover/tekan |
| `accent` | amber/terracotta `#D98A3D` | sorotan, badge |
| `bg` | `#FAFAF7` (cream lembut) | latar aplikasi siswa |
| `surface` | `#FFFFFF` | kartu, panel |
| `text` | `#1A2420` | teks utama |
| `muted` | `#5B6B63` | teks sekunder |
| `success/warn/danger` | hijau/kuning/merah standar | status kuis, feedback |

- Sediakan **mode gelap** (penting untuk pemakaian AR di ruang redup) — override via `prefers-color-scheme` + toggle manual.
- Dashboard guru: kurangi warna hijau pekat pada tabel; pakai netral + aksen warna hanya untuk status.

**Tipografi:** sans-serif yang enak dibaca di layar & mendukung Bahasa Indonesia — mis. **Plus Jakarta Sans** atau **Inter**. Skala modular (mis. 12/14/16/20/24/32). Boleh serif display untuk judul brand saja.

**Spacing:** basis 4px (4/8/12/16/24/32/48). **Radius:** 8–16px (kartu lembut). **Shadow:** halus, berlapis.

**Ikon:** Lucide (konsisten, open-source).

## UX Siswa (mobile)

**Navigasi bawah (bottom nav)** — 5 tab, target sentuh besar:

`Beranda` · `Pindai (AR)` · `Library` · `Kuis` · `Profil`

Alur inti:

- **Beranda**: lanjutkan materi, tugas mendatang, akses cepat "Pindai Kartu".
- **Pindai (AR)**: fokus kamera; deteksi kartu → panel konten mengambang; tombol rotate/zoom/"Lihat 3D".
- **Library**: daftar modul, indikator "tersedia offline", pencarian, bookmark.
- **Kuis**: latihan generatif (pilih topik) & tugas dari guru; layar soal fokus, umpan balik + pembahasan.
- **Tutor**: entri chat (bisa dari Beranda/Library), jawaban streaming + sumber.
- **Profil**: progres, badge, pengaturan, unduhan offline.

### State UX untuk AR (wajib dirancang eksplisit)

| State | Tampilan |
|---|---|
| Minta izin kamera | Layar onboarding menjelaskan kenapa kamera dibutuhkan sebelum prompt sistem |
| Mencari kartu | Overlay "Arahkan ke kartu NATURA", reticle/animasi pemindaian |
| Terdeteksi | Model 3D muncul menempel di kartu; panel info naik dari bawah |
| Tracking hilang | Pesan lembut "Kartu keluar dari layar — arahkan kembali" |
| Cahaya kurang / kartu tak dikenali | Tips ("tambah cahaya", "dekatkan kartu") + tombol bantuan |
| Simulasi multi-kartu | Indikator langkah (mis. 2/5), umpan balik benar/salah, prompt "scan kartu berikutnya" |
| Fallback tanpa AR | Tombol "Lihat 3D" (viewer tanpa kamera) |

## UX Guru (desktop)

- **Layout**: sidebar kiri (Dashboard, Kelas, Bank Soal, Konten, Pengaturan) + area konten lebar.
- **Dashboard**: kartu ringkasan (jumlah siswa aktif, rata-rata skor, tugas jatuh tempo) + grafik tren + daftar "siswa perlu perhatian".
- **Kelas**: tabel siswa (progres, skor terakhir, aktivitas AR), aksi cepat.
- **Buat kuis**: mode manual atau **generatif AI** → tampilkan draf soal → guru edit/hapus/setujui → publish. Selalu ada langkah review manusia.
- **Detail siswa**: linimasa aktivitas, jawaban kuis, dan riwayat percakapan tutor (untuk keamanan & pemahaman kesulitan siswa).
- **Responsif** turun ke tablet; tidak dioptimasi untuk HP kecil (sesuai persona guru).

## Aksesibilitas

- Kontras teks/latar memenuhi **WCAG 2.1 AA**.
- Target sentuh **≥ 44×44px**; jarak antar elemen memadai.
- Fokus keyboard & label ARIA untuk komponen interaktif (terutama dashboard).
- Jangan hanya mengandalkan warna untuk status kuis (tambah ikon/teks).
- Teks alternatif untuk gambar; transkrip/keterangan bila ada media.

## Pedoman Aset 3D

- Format **GLB** + kompresi **Draco**; anggaran poligon rendah; tekstur teroptimasi.
- Gaya visual konsisten antar model (pencahayaan, skala, orientasi default).
- Sertakan *thumbnail* untuk mode "Lihat 3D" dan daftar library.
