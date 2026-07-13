import Link from "next/link";
import { getPlants } from "@/lib/db/plants";
import { getTools } from "@/lib/db/tools";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Leaf, FlaskConical } from "lucide-react";

export default async function Pindai() {
  const [plants, tools] = await Promise.all([getPlants(), getTools()]);
  return (
    <div>
      <PageHeader title="Pindai & Jelajah 3D" />
      <div className="space-y-6 p-4">
        <section>
          <h2 className="mb-2 flex items-center gap-2 font-bold">
            <Leaf className="h-4 w-4 text-primary" /> Tanaman
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {plants.map((p) => (
              <Link key={p.id} href={`/pindai/${p.id}`}>
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
        </section>

        <section>
          <h2 className="mb-2 flex items-center gap-2 font-bold">
            <FlaskConical className="h-4 w-4 text-primary" /> Alat Laboratorium
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {tools.map((t) => (
              <Link key={t.id} href={`/pindai/${t.id}`}>
                <Card className="p-3">
                  <div className="mb-2 grid h-24 place-items-center rounded-xl bg-accent/10 text-4xl">
                    ⚗️
                  </div>
                  <div className="text-sm font-semibold">{t.nama}</div>
                  <div className="truncate text-xs text-muted">Alat lab</div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
