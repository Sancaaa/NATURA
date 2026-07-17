import { notFound } from "next/navigation";
import { getPlantDb } from "@/lib/db/plants";
import { arViewerHref } from "@/lib/ar";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { InfoRow } from "@/components/ui/InfoRow";
import { Model3DPanel } from "@/components/student/Model3DPanel";

export default async function DetailTanaman({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plant = await getPlantDb(id);
  if (!plant) notFound();

  const arHref = arViewerHref({
    type: "plant",
    id,
    model: plant.model3dUrl,
    target: plant.arTargetUrl,
  });

  return (
    <div>
      <PageHeader title={plant.namaLokal} back="/natulab/tanaman" />
      <div className="space-y-4 p-4">
        <Model3DPanel modelSrc={plant.model3dUrl} arHref={arHref} />

        <div className="space-y-4">
          <div>
            <div className="text-lg font-bold">{plant.namaLokal}</div>
            <div className="text-sm italic text-muted">
              {plant.namaLatin}
              {plant.familia ? ` · ${plant.familia}` : ""}
            </div>
          </div>
          <InfoRow label="Nama simplisia" value={plant.namaSimplisia} />
          <InfoRow label="Bagian digunakan" value={plant.bagianDigunakan} />
          {plant.kandungan.length > 0 && (
            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                Kandungan
              </div>
              <div className="flex flex-wrap gap-1.5">
                {plant.kandungan.map((k) => (
                  <Badge key={k} tone="primary">
                    {k}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <InfoRow label="Khasiat" value={plant.khasiat} />
          <InfoRow label="Ciri makroskopik" value={plant.makroskopik} />
          <InfoRow label="Ciri mikroskopik" value={plant.mikroskopik} />
        </div>
      </div>
    </div>
  );
}
