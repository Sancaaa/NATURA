import Link from "next/link";
import { getPlants } from "@/lib/db/plants";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { DeleteContentButton } from "@/components/admin/DeleteContentButton";
import { Pencil, Plus } from "lucide-react";

export default async function AdminTanaman() {
  const plants = await getPlants();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold">Kelola Tanaman</h1>
          <p className="text-sm text-muted">
            Konten tanaman obat yang tampil di menu Pindai & Jelajah 3D.
          </p>
        </div>
        <Link href="/admin/tanaman/baru" className={buttonClass("primary", "md")}>
          <Plus className="h-4 w-4" /> Tambah Tanaman
        </Link>
      </div>

      {plants.length === 0 ? (
        <Card className="text-sm text-muted">Belum ada tanaman.</Card>
      ) : (
        <div className="space-y-2">
          {plants.map((p) => (
            <Card key={p.id} className="flex flex-wrap items-center gap-3">
              {p.gambarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.gambarUrl}
                  alt={p.namaLokal}
                  className="h-11 w-11 rounded-xl object-cover"
                />
              ) : (
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-2xl">
                  🌿
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{p.namaLokal}</div>
                <div className="truncate text-xs italic text-muted">
                  {p.namaLatin}
                </div>
              </div>
              {p.model3dUrl && <Badge tone="primary">3D</Badge>}
              {p.arTargetUrl && <Badge tone="accent">AR</Badge>}
              <Link
                href={`/admin/tanaman/${p.id}`}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
              >
                <Pencil className="h-4 w-4" /> Edit
              </Link>
              <DeleteContentButton kind="plant" id={p.id} nama={p.namaLokal} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
