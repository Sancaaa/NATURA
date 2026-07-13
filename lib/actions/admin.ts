"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isServiceConfigured } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Pastikan pemanggil adalah admin. Kembalikan id-nya bila valid. */
async function requireAdmin(): Promise<{ id: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi berakhir." };
  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!me || me.role !== "admin") return { error: "Hanya admin." };
  return { id: user.id };
}

export async function updateUserRole(
  userId: string,
  role: string,
): Promise<{ ok?: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { error: "Mode demo — tidak disimpan." };
  if (!["student", "teacher", "admin"].includes(role))
    return { error: "Peran tidak valid." };

  const admin = await requireAdmin();
  if ("error" in admin) return { error: admin.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteUser(
  userId: string,
): Promise<{ ok?: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { error: "Mode demo — tidak disimpan." };

  const admin = await requireAdmin();
  if ("error" in admin) return { error: admin.error };
  if (admin.id === userId) return { error: "Tidak bisa menghapus akun sendiri." };

  if (!isServiceConfigured)
    return {
      error:
        "SUPABASE_SERVICE_ROLE_KEY belum diisi di .env.local (wajib untuk hapus user).",
    };

  // Hapus akun di auth.users → profil & data terkait ikut terhapus (ON DELETE CASCADE).
  const svc = createAdminClient();
  const { error } = await svc.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { ok: true };
}
