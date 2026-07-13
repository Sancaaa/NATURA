import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AdminUser = {
  id: string;
  nama: string;
  email: string | null;
  role: string;
};

const demoUsers: AdminUser[] = [
  { id: "d1", nama: "Aisyah Rahma", email: "aisyah@contoh.sch.id", role: "student" },
  { id: "d2", nama: "Budi Santoso", email: "budi@contoh.sch.id", role: "teacher" },
  { id: "d3", nama: "Admin Sekolah", email: "admin@contoh.sch.id", role: "admin" },
];

export async function getAllUsers(): Promise<AdminUser[]> {
  if (!isSupabaseConfigured) return demoUsers;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, nama, email, role")
    .order("created_at", { ascending: false });
  return (data ?? []) as AdminUser[];
}

export function adminStats(users: AdminUser[]) {
  return {
    total: users.length,
    murid: users.filter((u) => u.role === "student").length,
    guru: users.filter((u) => u.role === "teacher").length,
    admin: users.filter((u) => u.role === "admin").length,
  };
}
