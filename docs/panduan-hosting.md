# Panduan Hosting & Deployment NATURA

Dokumen ini menjelaskan langkah-langkah untuk melakukan *hosting* aplikasi NATURA ke server produksi. Berdasarkan arsitektur yang disepakati, aplikasi ini di-deploy dengan model:
- **Backend/Database:** Supabase Self-Hosted di infrastruktur on-premise.
- **Frontend (Next.js):** VPS (Virtual Private Server) publik dengan reverse proxy (Caddy/Nginx).

---

## 1. Kebutuhan Sistem (Prasyarat)

### A. Server Database (On-Premise)
- OS: Linux (Ubuntu 22.04 LTS direkomendasikan)
- RAM: Minimal 4GB (direkomendasikan 8GB karena pgvector dan layanan Supabase lainnya cukup berat)
- Docker & Docker Compose sudah terinstal.

### B. Server Frontend (VPS Publik)
- OS: Linux (Ubuntu 22.04 LTS)
- RAM: Minimal 1GB - 2GB
- Node.js (versi 18.x atau 20.x)
- PM2 (Process Manager untuk Node.js)
- Caddy Server (untuk HTTPS otomatis) atau Nginx.

---

## 2. Deployment Database (Supabase Self-Hosted)

Supabase dijalankan di server on-premise menggunakan Docker.
1. Clone repository Supabase:
   ```bash
   git clone --depth 1 https://github.com/supabase/supabase
   cd supabase/docker
   ```
2. Salin konfigurasi environment:
   ```bash
   cp .env.example .env
   ```
3. Sesuaikan file `.env`. Pastikan Anda mengganti *password* default PostgreSQL, JWT Secret, dan API Keys demi keamanan.
4. Jalankan Supabase:
   ```bash
   docker compose up -d
   ```
5. Akses Supabase Studio di `http://<IP_SERVER_ON_PREMISE>:8000` (pastikan hanya dapat diakses melalui VPN/Jaringan Privat jika memungkinkan).
6. Terapkan skema database NATURA:
   - Masuk ke menu SQL Editor di Supabase Studio.
   - Salin isi dari `supabase/schema.sql` (berisi tabel, RLS, dan pgvector).
   - Jalankan query tersebut.

---

## 3. Deployment Aplikasi Web (Next.js)

Jalankan langkah ini di VPS publik Anda.

### A. Persiapan Aplikasi
1. Clone repository aplikasi NATURA:
   ```bash
   git clone <URL_REPO_NATURA> natura-app
   cd natura-app
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Buat file `.env.production` atau `.env.local` di server:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="http://<IP_SERVER_ON_PREMISE>:8000"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="<ANON_KEY_DARI_SUPABASE>"
   GEMINI_API_KEY="<KEY_GEMINI_ANDA>"
   ```
   *(Catatan: Pastikan VPS dapat berkomunikasi dengan IP Server On-Premise, misal melalui VPN seperti Tailscale/Wireguard).*

4. Build aplikasi Next.js:
   ```bash
   npm run build
   ```

### B. Menjalankan dengan PM2
Agar aplikasi tetap berjalan meskipun server direstart:
```bash
npm install -g pm2
pm2 start npm --name "natura-web" -- start
pm2 save
pm2 startup
```
Aplikasi sekarang berjalan di `http://localhost:3000` secara internal di VPS.

---

## 4. Konfigurasi Domain dan HTTPS (Caddy)

Kita akan menggunakan **Caddy** untuk mengekspos aplikasi ke publik karena Caddy menyediakan HTTPS/SSL otomatis (Let's Encrypt).

1. Instal Caddy Server di VPS mengikuti dokumentasi resmi (https://caddyserver.com/docs/install).
2. Edit file `Caddyfile` (biasanya di `/etc/caddy/Caddyfile`):
   ```caddyfile
   natura.domainanda.com {
       reverse_proxy localhost:3000
   }
   ```
3. Restart Caddy:
   ```bash
   sudo systemctl restart caddy
   ```

Aplikasi NATURA kini dapat diakses secara aman di `https://natura.domainanda.com`.
