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

export type NewUserInput = {
  nama: string;
  email: string;
  password: string;
  role: string;
};

/** Buat akun baru (oleh admin). Butuh service-role key. Email langsung
 *  dikonfirmasi agar pengguna bisa segera masuk; profil dibuat otomatis oleh
 *  trigger handle_new_user dari user_metadata (nama/role). */
export async function createUser(
  input: NewUserInput,
): Promise<{ ok?: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { error: "Perubahan tidak dapat disimpan saat ini." };

  const nama = (input.nama || "").trim();
  const email = (input.email || "").trim().toLowerCase();
  const password = input.password || "";
  const role = input.role;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "Email tidak valid." };
  if (password.length < 6)
    return { error: "Kata sandi minimal 6 karakter." };
  if (!["student", "teacher", "admin"].includes(role))
    return { error: "Peran tidak valid." };

  const admin = await requireAdmin();
  if ("error" in admin) return { error: admin.error };

  if (!isServiceConfigured)
    return {
      error:
        "SUPABASE_SERVICE_ROLE_KEY belum diisi di .env.local (wajib untuk membuat user).",
    };

  const svc = createAdminClient();
  const { error } = await svc.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nama, role },
  });
  if (error) {
    // Supabase mengembalikan 422 bila email sudah terpakai.
    if (/already/i.test(error.message))
      return { error: "Email sudah terdaftar." };
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { ok: true };
}

export async function updateUserRole(
  userId: string,
  role: string,
): Promise<{ ok?: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { error: "Perubahan tidak dapat disimpan saat ini." };
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
  if (!isSupabaseConfigured) return { error: "Perubahan tidak dapat disimpan saat ini." };

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
