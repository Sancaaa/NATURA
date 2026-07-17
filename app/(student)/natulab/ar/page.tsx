import { redirect } from "next/navigation";
import { getPlants } from "@/lib/db/plants";
import { getTools } from "@/lib/db/tools";
import { arViewerHref } from "@/lib/ar";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

/**
 * Gateway AR: langsung buka kamera scanner (viewer.html) untuk konten
 * pertama yang punya target (.mind) — tanpa layar pemilih. Data-driven:
 * memakai target apa pun yang tersedia (saat ini Sambiloto yang sudah works).
 */
export default async function ArGateway() {
  const [plants, tools] = await Promise.all([getPlants(), getTools()]);

  const plant = plants.find((p) => p.arTargetUrl);
  if (plant) {
    redirect(
      arViewerHref({
        type: "plant",
        id: plant.id,
        model: plant.model3dUrl,
        target: plant.arTargetUrl,
      })!,
    );
  }
  const tool = tools.find((t) => t.arTargetUrl);
  if (tool) {
    redirect(
      arViewerHref({
        type: "tool",
        id: tool.id,
        model: tool.model3dUrl,
        target: tool.arTargetUrl,
      })!,
    );
  }

  // Belum ada konten ber-target AR.
  return (
    <div>
      <PageHeader title="Visualisasi AR" back="/natulab" />
      <div className="p-4">
        <Card className="border-dashed text-sm text-muted">
          Belum ada konten dengan target AR (.mind). Admin perlu mengunggah
          berkas target pada tanaman atau alat terlebih dahulu.
        </Card>
      </div>
    </div>
  );
}
