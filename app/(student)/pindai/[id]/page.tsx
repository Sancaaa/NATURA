import { notFound } from "next/navigation";
import { getPlantDb, type Plant } from "@/lib/db/plants";
import { getToolDb, type LabTool } from "@/lib/db/tools";
import ModelViewerLazy from "@/components/three/ModelViewerLazy";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { Camera } from "lucide-react";

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </div>
      <div className="text-sm">{value}</div>
    </div>
  );
}

function PlantInfo({ plant }: { plant: Plant }) {
  return (
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
  );
}

function ToolInfo({ tool }: { tool: LabTool }) {
  return (
    <div className="space-y-4">
      <div className="text-lg font-bold">{tool.nama}</div>
      <InfoRow label="Fungsi" value={tool.fungsi} />
      <InfoRow label="Cara pakai" value={tool.caraPakai} />
      <InfoRow label="Keselamatan" value={tool.keselamatan} />
    </div>
  );
}

export default async function Detail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [plant, tool] = await Promise.all([getPlantDb(id), getToolDb(id)]);

  if (!plant && !tool) notFound();

  const title = plant ? plant.namaLokal : tool!.nama;
  const modelSrc = plant?.model3dUrl ?? tool?.model3dUrl;
  const arTarget = plant?.arTargetUrl ?? tool?.arTargetUrl;

  // Viewer AR data-driven: kirim jenis+id (untuk anotasi) & aset (model+target).
  const arHref =
    arTarget &&
    `/ar/viewer.html?type=${plant ? "plant" : "tool"}&id=${encodeURIComponent(id)}` +
      (modelSrc ? `&model=${encodeURIComponent(modelSrc)}` : "") +
      `&target=${encodeURIComponent(arTarget)}`;

  return (
    <div>
      <PageHeader title={title} back="/pindai" />
      <div className="space-y-4 p-4">
        <div className="h-72 overflow-hidden rounded-2xl border border-line">
          <ModelViewerLazy src={modelSrc} className="h-full w-full" />
        </div>

        {arHref && (
          <a
            href={arHref}
            className={`${buttonClass("primary", "md")} w-full`}
          >
            <Camera className="h-4 w-4" /> Buka Mode AR (Kamera)
          </a>
        )}

        {plant ? <PlantInfo plant={plant} /> : <ToolInfo tool={tool!} />}
      </div>
    </div>
  );
}
