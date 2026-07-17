import Link from "next/link";
import { getPlants } from "@/lib/db/plants";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

export default async function VisualisasiTanaman() {
  const plants = await getPlants();
  return (
    <div>
      <PageHeader title="Visualisasi Tanaman" back="/natulab" />
      <div className="p-4">
        {plants.length === 0 ? (
          <Card className="border-dashed text-sm text-muted">
            Belum ada data tanaman.
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {plants.map((p) => (
              <Link key={p.id} href={`/natulab/tanaman/${p.id}`}>
                <Card className="p-3">
                  <div className="mb-2 grid h-24 place-items-center rounded-xl bg-primary/10 text-4xl">
                    🌿
                  </div>
                  <div className="text-sm font-semibold">{p.namaLokal}</div>
                  <div className="truncate text-xs italic text-muted">
                    {p.namaLatin}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
