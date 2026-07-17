import Link from "next/link";
import { getTools } from "@/lib/db/tools";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

export default async function VisualisasiAlat() {
  const tools = await getTools();
  return (
    <div>
      <PageHeader title="Visualisasi Alat Lab" back="/natulab" />
      <div className="p-4">
        {tools.length === 0 ? (
          <Card className="border-dashed text-sm text-muted">
            Belum ada data alat laboratorium.
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {tools.map((t) => (
              <Link key={t.id} href={`/natulab/alat/${t.id}`}>
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
        )}
      </div>
    </div>
  );
}
