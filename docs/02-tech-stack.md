# 02 — Tech Stack & Arsitektur

## Batasan Infrastruktur (menentukan banyak keputusan)

- **Self-host**: tersedia server **on-premise** + **VPS**. Data sedapat mungkin di infrastruktur sendiri (bonus privasi untuk data siswa di bawah umur).
- **Tanpa GPU**: semua komponen yang berjalan di infrastruktur sendiri harus jalan di **CPU** — Next.js, Postgres, pgvector, embedding kecil, object storage semuanya CPU-friendly.
- **LLM adalah satu-satunya ketergantungan cloud**: model bahasa yang bagus tidak realistis di-*self-host* tanpa GPU, jadi kita pakai **Gemini Flash (API cloud)**. Ini justru menyederhanakan: seluruh sistem self-host, hanya panggilan LLM yang keluar.

## Ringkasan Pilihan

| Lapisan | Pilihan | Alasan singkat |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Satu codebase untuk PWA siswa, dashboard guru, dan API (proxy LLM). |
| PWA | **Serwist / next-pwa (Workbox)** | Offline caching, installable. |
| UI | **Tailwind CSS + shadcn/ui + Radix** | Cepat & konsisten; shadcn untuk dashboard, Radix untuk komponen mobile aksesibel. |
| State | **TanStack Query** + **Zustand** | Server state + UI state. |
| AR | **MindAR (image tracking) + Three.js / react-three-fiber** | Kartu = *image target*; jalan di Android **dan** iOS. |
| 3D | **glTF/GLB + Draco** via **@react-three/fiber + drei** | Format 3D web standar, ukuran kecil. |
| Backend & DB | **Supabase self-hosted** (Docker): Postgres, Auth (GoTrue), Storage, Realtime, RLS | Relasional + auth berbasis peran + RLS + `pgvector`, semua di infrastruktur sendiri. |
| Vector store | **pgvector** (di Postgres) | Pencarian kemiripan jalan di CPU — tak butuh GPU/DB vektor terpisah. |
| **LLM** | **Google Gemini Flash** | Tutor Q&A & pembuatan kuis. Cepat, murah, ada free tier. |
| Embeddings | **Model kecil di CPU** (fastembed/ONNX, mis. `multilingual-e5-small`) — atau Gemini Embeddings API | RAG tanpa GPU; model multilingual mendukung Bahasa Indonesia. |
| Object storage | **Supabase Storage** (bawaan) atau **MinIO** (S3-compatible, self-host) | Simpan model 3D, gambar, buku. |
| Reverse proxy / TLS | **Caddy** (atau Traefik/Nginx) | HTTPS otomatis (Let's Encrypt) di VPS. |
| VPN antar-node | **WireGuard / Tailscale** | Hubungkan on-premise ↔ VPS secara privat. |
| Deploy | **Docker + Docker Compose** | Konsisten di on-prem & VPS. |
| Observability | **Sentry** (self-host / SaaS) + **PostHog** (self-host) | Error & analitik, bisa di infrastruktur sendiri. |
| Testing/CI | **Vitest + Playwright + GitHub Actions** | Unit/e2e + otomasi. |

> **Alternatif lebih ringan dari Supabase self-host** (yang lumayan berat secara operasional): **Postgres + pgvector** langsung + **Auth.js (NextAuth)** untuk autentikasi + **MinIO** untuk storage. Trade-off: kehilangan Realtime & RLS bawaan Supabase, jadi logika otorisasi pindah ke lapisan aplikasi. Rekomendasi: mulai dengan Supabase self-host agar arsitektur & RLS tetap sama seperti rencana awal.

## Arsitektur Sistem

Pemisahan peran node: **VPS** jadi permukaan publik (diakses siswa/guru dari internet, punya IP publik & TLS), **on-premise** menyimpan data (di balik VPN privat). Ini menjaga data siswa tetap di infrastruktur sendiri dan mempersempit permukaan publik.

```
        Internet (siswa mobile / guru desktop)
                        │  HTTPS
                        ▼
        ┌───────────────────────────────────┐
        │  VPS (publik)                     │
        │  - Caddy (reverse proxy + TLS)    │
        │  - Next.js (PWA + dashboard + API)│
        │    • proxy LLM (kunci di server)  │
        │    • endpoint RAG & generasi kuis │
        └───────────────┬───────────────────┘
                        │ WireGuard / Tailscale (privat)
                        ▼
        ┌───────────────────────────────────┐        ┌────────────────────┐
        │  On-premise (privat, tanpa GPU)   │        │  Google Gemini API │
        │  - Supabase self-host             │◄──────►│  (satu-satunya      │
        │    (Postgres + pgvector, Auth,    │  hanya │   dependensi cloud) │
        │     Storage, Realtime, RLS)       │  teks  │  Gemini Flash       │
        │  - Layanan embedding (CPU)        │        └────────────────────┘
        │  - Object storage (Storage/MinIO) │
        │  - Backup terjadwal (pg_dump)     │
        └───────────────────────────────────┘
```

**Catatan penempatan**: jika koneksi internet on-premise tidak stabil (IP dinamis/NAT, bandwidth terbatas), taruh **database di VPS** juga dan gunakan on-premise untuk **backup / origin aset / build / dev**. VPN privat (WireGuard/Tailscale) mengatasi NAT tanpa membuka port publik di on-premise.

**Tanpa GPU**: seluruh komponen di atas berjalan di CPU. Beban berat AI (inferensi model bahasa) di-*offload* ke Gemini.

## AR: Pendekatan & Alasan

**Masalah**: WebXR AR **tidak** didukung Safari iOS — kalau mengandalkannya, pengguna iPhone tak kebagian AR.

**Solusi**: **image-tracking WebAR** — kamera (`getUserMedia`) + computer vision di browser, jalan di Android **dan** iOS.

| Opsi | Catatan |
|---|---|
| **MindAR** *(rekomendasi)* | Image tracking modern, integrasi Three.js/A-Frame, gratis & open-source. Tiap kartu = satu *image target*. Mendukung *multi-target* → untuk simulasi multi-kartu. |
| AR.js (NFT) | Lebih ringan, kualitas tracking di bawah MindAR. |
| model-viewer (Google) | Untuk "lihat 1 model di ruangan"; **bukan** tracking kartu kustom. Berguna sebagai *fallback* "Lihat 3D". |
| 8th Wall | Markerless SLAM kuat, **berbayar**. Simpan bila butuh world-tracking & ada anggaran. |

**Alur produksi kartu**: desain kartu (gambar unik, kontras tinggi) → kompilasi jadi *image target* (`.mind`) → petakan target ke aset 3D (GLB) + konten di database.

**Simulasi lab**: *state machine* yang digerakkan kartu terdeteksi (scan kartu berurutan → validasi langkah → animasi/umpan balik).

**Fallback**: bila kamera/AR tak tersedia, sediakan mode **"Lihat 3D"** (viewer `@react-three/fiber` tanpa kamera).

> Catatan: semua pemrosesan AR terjadi **di perangkat pengguna** (browser), bukan di server kita — jadi tak menambah beban komputasi infrastruktur tanpa GPU.

## LLM: Tutor & Pembuatan Kuis (Gemini Flash)

**Prinsip keamanan**: API key Gemini **hanya di server** (Next.js Route Handler / API). Klien tak pernah memanggil Gemini langsung.

### Pemilihan model (tiering)

| Kegunaan | Model | Catatan |
|---|---|---|
| Tutor Q&A & pembuatan kuis (default) | **Gemini 2.5 Flash** (`gemini-2.5-flash`) | Cepat, murah, multimodal, mendukung Bahasa Indonesia. |
| Tugas ringan/volume tinggi (hint, klasifikasi topik, ringkas) | **Gemini 2.5 Flash-Lite** (`gemini-2.5-flash-lite`) | Termurah/tercepat. |

> Verifikasi ID model terbaru di dokumentasi Google saat implementasi (penamaan bisa berubah). Ada **free tier** (dengan batas laju) yang berguna untuk tahap mockup & pengembangan. Untuk produksi/skala kelas, gunakan tier berbayar (dan cek kebijakan penggunaan data — tier berbayar umumnya **tidak** memakai data untuk melatih model).

### Teknik penting

- **Structured output**: pakai `responseMimeType: "application/json"` + `responseSchema` agar kuis keluar sebagai JSON valid (soal, opsi, kunci, pembahasan). Hindari parsing teks bebas.
- **Safety settings**: Gemini punya `safetySettings` per kategori bahaya — **penting** karena pengguna anak di bawah umur. Setel ketat + guardrail di *system instruction* (peran = tutor farmakognosi SMK, Bahasa Indonesia, tolak topik di luar cakupan/tak pantas).
- **Streaming** (`generateContentStream`) untuk jawaban tutor → UX responsif.
- **Context caching** Gemini untuk konteks materi yang berulang → hemat biaya.
- **SDK**: `@google/genai` (SDK unified terbaru untuk Node/TypeScript).

### RAG (grounding tutor & sumber soal) — tanpa GPU

1. Ingest item library → potong jadi *chunk* → buat **embedding di CPU** (mis. `multilingual-e5-small` via fastembed/ONNX — kecil, cukup untuk Bahasa Indonesia, tak butuh GPU) → simpan di `pgvector`.
2. Saat siswa bertanya: embed pertanyaan → *retrieve* chunk relevan → susun prompt (materi + pertanyaan) → jawaban Gemini menyertakan **sumber**.
3. Manfaat: jawaban akurat, sesuai materi sekolah, terlacak sumbernya (mengurangi halusinasi).

> Alternatif embedding: **Gemini Embeddings API** (mis. `gemini-embedding-001`) — lebih simpel tapi menambah panggilan cloud. Pilih embedding CPU lokal bila ingin RAG tetap di infrastruktur sendiri.

## Deployment & Operasional (self-host)

- **Docker Compose** per node: (VPS) Caddy + Next.js; (on-prem) stack Supabase + layanan embedding + storage.
- **TLS otomatis** via Caddy (Let's Encrypt) di VPS.
- **VPN privat** (WireGuard/Tailscale) menghubungkan Next.js (VPS) ke Postgres/Storage (on-prem) tanpa membuka port publik di on-prem.
- **Backup**: `pg_dump` terjadwal + salinan object storage; simpan offsite.
- **CI/CD**: GitHub Actions build image → deploy ke VPS (SSH/registry) → migrasi DB.
- **Sizing**: mulai kecil (2–4 vCPU / 4–8 GB per node); pantau dengan Sentry + PostHog (keduanya bisa self-host).

## Offline / PWA

- **Di-cache**: app shell, aset AR (GLB, `.mind`), gambar, item library yang diunduh siswa.
- **Butuh jaringan**: tutor AI, kuis generatif, sinkron progres — tampilkan status offline dengan jelas.
- Strategi Workbox: *cache-first* untuk aset statis & 3D, *network-first* untuk data dinamis, *stale-while-revalidate* untuk library.

## Keamanan & Privasi Data (pengguna anak di bawah umur)

- **Data di infrastruktur sendiri** (on-prem) → kontrol penuh atas data siswa; hanya **teks** yang dikirim ke Gemini keluar dari sistem.
- **Minimalkan PII yang dikirim ke LLM** — jangan sertakan nama/identitas siswa dalam prompt bila tak perlu.
- **Row-Level Security**: siswa hanya akses datanya & kelas yang diikuti; guru hanya kelas yang diampu.
- Percakapan tutor tersimpan untuk visibilitas guru & audit; batasi aksesnya.
- Setel `safetySettings` Gemini ketat + guardrail konten; tangani penolakan model dengan anggun.
