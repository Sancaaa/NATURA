import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseUrl, supabaseAnonKey, isSupabaseConfigured } from "./config";

/**
 * Menyegarkan sesi Supabase pada tiap request (menulis ulang cookie token bila
 * di-refresh). TIDAK me-redirect - gerbang akses ada di requireRole() pada
 * layout tiap area. Dengan begitu, error jaringan sesaat ke server Auth tidak
 * langsung melempar pengguna yang sudah login ke /masuk.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Mode demo (Supabase belum dikonfigurasi): lewati.
  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Memicu refresh token bila perlu; cookie baru ditulis lewat setAll di atas.
  await supabase.auth.getUser();

  return response;
}
