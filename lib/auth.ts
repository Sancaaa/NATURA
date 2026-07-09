import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type Role = "student" | "teacher" | "admin";
export type Profile = { id: string; nama: string; role: Role };

/**
 * Profil pengguna yang sedang login (server-side).
 * Mengembalikan null bila mode demo atau belum login.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, nama, role")
    .eq("id", user.id)
    .single();

  if (!data) {
    return { id: user.id, nama: user.email ?? "", role: "student" };
  }
  return data as Profile;
}

export const homeFor = (role: Role) =>
  role === "teacher" || role === "admin" ? "/dashboard" : "/beranda";
