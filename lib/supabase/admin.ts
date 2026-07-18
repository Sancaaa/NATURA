import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./config";

const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

/** True bila service-role key tersedia (diperlukan untuk hapus user). */
export const isServiceConfigured =
  supabaseUrl.length > 0 && serviceKey.length > 0;

/**
 * Klien Supabase dengan **service role** - HANYA server, jangan pernah diimpor
 * ke komponen client. Untuk operasi admin (mis. hapus akun auth.users).
 */
export function createAdminClient() {
  return createSupabaseClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
