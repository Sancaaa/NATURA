import Link from "next/link";
import { getPlants } from "@/lib/db/plants";
import { getTools } from "@/lib/db/tools";
import { arViewerHref } from "@/lib/ar";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Camera, ChevronRight } from "lucide-react";

/**
 * Gateway kamera AR: kamera butuh target (.mind) per konten, jadi siswa
 * memilih dulu kartu yang sedang dipegang. Hanya konten ber-target yang
 * ditampilkan — sisanya tidak bisa dibuka di AR.
 */
export default async function ArPicker() {
  const [plants, tools] = await Promise.all([getPlants(), getTools()]);

  const kartu = [
    ...plants.map((p) => ({
      id: p.id,
      nama: p.namaLokal,
      sub: p.namaLatin,
      emoji: "🌿",
      href: arViewerHref({
        type: "plant",
        id: p.id,
        model: p.model3dUrl,
        target: p.arTargetUrl,
      }),
    })),
    ...tools.map((t) => ({
      id: t.id,
      nama: t.nama,
      sub: "Alat lab",
      emoji: "⚗️",
      href: arViewerHref({
        type: "tool",
        id: t.id,
        model: t.model3dUrl,
        target: t.arTargetUrl,
      }),
    })),
  ].filter((k) => k.href);

  return (
    <div>
      <PageHeader title="Visualisasi AR" back="/natulab" />
      <div className="space-y-4 p-4">
        <div className="rounded-2xl bg-primary p-4 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15">
              <Camera className="h-5 w-5" />
            </span>
            <p className="text-sm text-white/90">
              Pilih kartu yang kamu pegang, lalu arahkan kamera ke kartunya.
            </p>
          </div>
        </div>

        {kartu.length === 0 ? (
          <Card className="border-dashed text-sm text-muted">
            Belum ada konten dengan target AR. Admin perlu mengunggah berkas
            target (.mind) pada tanaman atau alat terlebih dahulu.
          </Card>
        ) : (
          <div className="space-y-2">
            {kartu.map((k) => (
              // Navigasi halaman penuh (bukan <Link>) — viewer AR adalah
              // halaman statis di luar router Next.
              <a key={k.id} href={k.href!} className="block">
                <Card className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-2xl">
                    {k.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {k.nama}
                    </span>
                    <span className="block truncate text-xs italic text-muted">
                      {k.sub}
                    </span>
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
                </Card>
              </a>
            ))}
          </div>
        )}

        <Link
          href="/natulab/tanaman"
          className="block text-center text-xs font-semibold text-primary"
        >
          Tidak punya kartu? Lihat mode 3D →
        </Link>
      </div>
    </div>
  );
}
