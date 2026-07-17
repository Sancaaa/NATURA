"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Keluar (logout).
 *
 * WAJIB berupa Server Action (POST), bukan GET route. Sebelumnya logout
 * memakai `app/keluar/route.ts` (GET) yang dipanggil lewat `<Link href="/keluar">`.
 * Next.js otomatis mem-*prefetch* `<Link>` yang terlihat di layar, sehingga
 * GET /keluar ikut terpanggil tanpa diklik → `signOut()` jalan → cookie sesi
 * terhapus tepat setelah login ("Sesi berakhir"). Aksi dengan efek samping
 * tidak boleh berada di GET.
 */
export async function signOutAction() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
