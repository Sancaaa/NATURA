import { getPlants } from "@/lib/db/plants";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { PlantCard } from "@/components/student/ContentCards";

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
          <div className="grid grid-cols-2 gap-3.5">
            {plants.map((p) => (
              <PlantCard key={p.id} plant={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
