import { redirect } from "next/navigation";

// Scanner AR generik: langsung buka kamera (halaman statis A-Frame). Viewer
// memuat sendiri target yang tersedia (Sambiloto) — tak perlu parameter.
// Disimpan sebagai fallback bila ada tautan lama ke /natulab/ar.
export default function ArGateway() {
  redirect("/ar/viewer.html");
}
