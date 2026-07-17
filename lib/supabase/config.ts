// .trim() penting: spasi/CRLF di .env (umum di Windows) membuat URL tak valid
// untuk fetch sisi-server (Node melempar ERR_INVALID_URL) sehingga getUser()
// gagal & sesi seolah "berakhir", walau login sisi-browser tampak berhasil.
export const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
export const supabaseAnonKey = (
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
).trim();

/**
 * True jika kredensial Supabase tersedia. Bila false, aplikasi berjalan
 * dalam "mode demo" memakai data contoh (lib/data) tanpa autentikasi —
 * berguna untuk merekam video Fase 0 tanpa menyiapkan backend.
 */
export const isSupabaseConfigured =
  supabaseUrl.length > 0 && supabaseAnonKey.length > 0;
