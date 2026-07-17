import { getPlants } from "@/lib/db/plants";
import { getTools } from "@/lib/db/tools";
import { SAMPLE_SCENARIOS } from "@/lib/praktikum/samples";
import { AppHeader } from "@/components/student/AppHeader";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import {
  PlantCard,
  ToolCard,
  PraktikumCard,
} from "@/components/student/ContentCards";
import { ScanLine } from "lucide-react";

export default async function NatuLab() {
  const [plants, tools] = await Promise.all([getPlants(), getTools()]);
  const scenarios = Object.values(SAMPLE_SCENARIOS);

  return (
    <div>
      <AppHeader title="NatuLab" />

      <div className="space-y-8 p-4">
        <HeroBanner
          icon={ScanLine}
          title="AR Visualization"
          description="Pindai spesimen untuk visualisasi 3D interaktif dalam lingkungan laboratorium nyata."
          ctaLabel="Mulai Pindai"
          ctaHref="/natulab/ar"
        />

        <section>
          <SectionHeader title="Visualisasi Tanaman" href="/natulab/tanaman" />
          {plants.length === 0 ? (
            <Card className="border-dashed text-sm text-muted">
              Belum ada data tanaman.
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-3.5">
              {plants.slice(0, 4).map((p) => (
                <PlantCard key={p.id} plant={p} />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader title="Alat Laboratorium" href="/natulab/alat" />
          {tools.length === 0 ? (
            <Card className="border-dashed text-sm text-muted">
              Belum ada data alat.
            </Card>
          ) : (
            <div className="space-y-3">
              {tools.slice(0, 2).map((t) => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader
            title="Simulasi Praktikum"
            href="/natulab/praktikum"
          />
          {scenarios.length === 0 ? (
            <Card className="border-dashed text-sm text-muted">
              Belum ada skenario praktikum.
            </Card>
          ) : (
            <PraktikumCard scenario={scenarios[0]} />
          )}
        </section>
      </div>
    </div>
  );
}
