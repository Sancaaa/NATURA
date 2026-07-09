export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * True jika kredensial Supabase tersedia. Bila false, aplikasi berjalan
 * dalam "mode demo" memakai data contoh (lib/data) tanpa autentikasi —
 * berguna untuk merekam video Fase 0 tanpa menyiapkan backend.
 */
export const isSupabaseConfigured =
  supabaseUrl.length > 0 && supabaseAnonKey.length > 0;
