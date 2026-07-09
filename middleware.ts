import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Semua rute kecuali aset statis, gambar, model AR, dan API.
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|models|ar|api|.*\\.(?:png|jpg|jpeg|svg|glb|mind)).*)",
  ],
};
