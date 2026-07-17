import { notFound } from "next/navigation";
import { getToolDb } from "@/lib/db/tools";
import { arViewerHref } from "@/lib/ar";
import { PageHeader } from "@/components/ui/PageHeader";
import { InfoRow } from "@/components/ui/InfoRow";
import { Model3DPanel } from "@/components/student/Model3DPanel";

export default async function DetailAlat({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tool = await getToolDb(id);
  if (!tool) notFound();

  const arHref = arViewerHref({
    type: "tool",
    id,
    model: tool.model3dUrl,
    target: tool.arTargetUrl,
  });

  return (
    <div>
      <PageHeader title={tool.nama} back="/natulab/alat" />
      <div className="space-y-4 p-4">
        <Model3DPanel modelSrc={tool.model3dUrl} arHref={arHref} />

        <div className="space-y-4">
          <div className="text-lg font-bold">{tool.nama}</div>
          <InfoRow label="Fungsi" value={tool.fungsi} />
          <InfoRow label="Cara pakai" value={tool.caraPakai} />
          <InfoRow label="Keselamatan" value={tool.keselamatan} />
        </div>
      </div>
    </div>
  );
}
