import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type Role = "student" | "teacher" | "admin";
export type Profile = { id: string; nama: string; role: Role };

/**
 * Profil pengguna yang sedang login (server-side).
 * - Dibungkus `cache()` → hanya dijalankan SEKALI per request (mengurangi
 *   panggilan jaringan ke server Auth dan peluang gagal → false logout).
 * - Membaca profil lewat RPC `current_profile` (SECURITY DEFINER) yang kebal
 *   masalah RLS pada tabel profiles, sehingga peran (mis. admin) terbaca benar.
 * - TIDAK lagi jatuh ke "student" secara diam-diam bila gagal — error dicatat
 *   agar akar masalah terlihat.
 */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error(`[NATURA] getUser gagal: ${userError.message}`);
    return null;
  }
  const user = userData?.user;
  if (!user) return null;

  const { data, error } = await supabase.rpc("current_profile");
  if (error) {
    console.error(
      `[NATURA] Baca profil gagal (${user.email}): ${error.code ?? ""} ${error.message}`,
    );
    return null;
  }
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) {
    console.warn(
      `[NATURA] Profil kosong untuk ${user.email}. ` +
        `Kemungkinan: fungsi current_profile belum diterapkan, baris profiles ` +
        `belum ada, atau JWT tak diterima database (cek JWT secret / SITE_URL).`,
    );
    return null;
  }
  return { id: row.id, nama: row.nama ?? "", role: row.role as Role };
});

/** Halaman awal sesuai peran. */
export const homeFor = (role: Role) =>
  role === "admin"
    ? "/admin"
    : role === "teacher"
      ? "/dashboard"
      : "/beranda";

/**
 * Gerbang akses per peran untuk dipakai di layout area (satu-satunya gerbang;
 * middleware hanya menyegarkan sesi, tidak me-redirect).
 * - Mode demo: tidak menggerbang.
 * - Belum login / profil tak terbaca: diarahkan ke /masuk.
 * - Peran tak diizinkan: diarahkan ke beranda perannya.
 */
export async function requireRole(allowed: Role[]): Promise<Profile | null> {
  if (!isSupabaseConfigured) return null;
  const profile = await getCurrentProfile();
  if (!profile) redirect("/masuk");
  if (!allowed.includes(profile.role)) redirect(homeFor(profile.role));
  return profile;
}
