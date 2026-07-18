import Link from "next/link";
import { ArrowUpRight, Microscope } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Plant } from "@/lib/db/plants";
import type { LabTool } from "@/lib/db/tools";
import type { ScenarioDefinition } from "@/lib/praktikum/types";

/** Badge kategori tanaman dari bagian yang digunakan (data asli). */
function plantTag(p: Plant): string {
  const src = p.bagianDigunakan || p.familia || "Tanaman";
  return src.split(/[\s,/]+/)[0].toUpperCase().slice(0, 10);
}

/**
 * Kartu tanaman bergaya referensi: tile gambar (placeholder gradien +
 * emoji, karena data belum punya foto) dengan badge, lalu nama + latin.
 */
export function PlantCard({ plant }: { plant: Plant }) {
  return (
    <Link href={`/natulab/tanaman/${plant.id}`} className="group block">
      <div className="overflow-hidden rounded-3xl border border-line/70 bg-surface shadow-card transition group-hover:shadow-card-hover">
        <div className="relative aspect-[5/4] overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-accent/10">
          {plant.gambarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={plant.gambarUrl}
              alt={plant.namaLokal}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center text-5xl">
              <span className="transition group-hover:scale-110">🌿</span>
            </div>
          )}
          <span className="absolute right-2.5 top-2.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
            {plantTag(plant)}
          </span>
        </div>
        <div className="p-3.5">
          <div className="truncate font-bold">{plant.namaLokal}</div>
          <div className="truncate text-xs italic text-muted">
            {plant.namaLatin}
          </div>
        </div>
      </div>
    </Link>
  );
}

/** Kartu alat lab bergaya list: thumbnail kiri, nama + fungsi + "Detail Alat". */
export function ToolCard({ tool }: { tool: LabTool }) {
  return (
    <Link href={`/natulab/alat/${tool.id}`} className="group block">
      <Card className="flex items-center gap-4 transition group-hover:shadow-card-hover">
        {tool.gambarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tool.gambarUrl}
            alt={tool.nama}
            className="h-16 w-16 shrink-0 rounded-2xl object-cover"
          />
        ) : (
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-accent/10 text-3xl">
            ⚗️
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="font-bold">{tool.nama}</div>
          <p className="line-clamp-2 text-xs leading-relaxed text-muted">
            {tool.fungsi || "Alat laboratorium farmakognosi."}
          </p>
          <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-primary">
            Detail Alat <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
}

/** Kartu besar simulasi praktikum: banner + judul + langkah + CTA. */
export function PraktikumCard({ scenario }: { scenario: ScenarioDefinition }) {
  return (
    <Link href={`/natulab/praktikum/${scenario.id}`} className="group block">
      <Card className="overflow-hidden p-0 transition group-hover:shadow-card-hover">
        <div className="relative grid aspect-[16/9] place-items-center bg-gradient-to-br from-primary via-[#2a49ff] to-primary-dark text-white">
          <Microscope className="h-14 w-14 opacity-90" />
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold">{scenario.judul}</h3>
          {scenario.deskripsi && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
              {scenario.deskripsi}
            </p>
          )}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted">
              {scenario.steps.length} langkah
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">
              Mulai Praktikum →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
