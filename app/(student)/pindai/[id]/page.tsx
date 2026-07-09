"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import { getPlant, type Plant } from "@/lib/data/plants";
import { getTool, type LabTool } from "@/lib/data/tools";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Box, Camera } from "lucide-react";

const ModelViewer = dynamic(
  () => import("@/components/three/ModelViewer"),
  { ssr: false },
);
const ARScene = dynamic(() => import("@/components/ar/ARScene"), {
  ssr: false,
});

function InfoRow({ label, value }: { label: string; value: string }) {
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
          {plant.namaLatin} · {plant.familia}
        </div>
      </div>
      <InfoRow label="Nama simplisia" value={plant.namaSimplisia} />
      <InfoRow label="Bagian digunakan" value={plant.bagianDigunakan} />
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

export default function Detail() {
  const params = useParams();
  const id = String(params.id);
  const plant = getPlant(id);
  const tool = getTool(id);
  const [mode, setMode] = useState<"3d" | "ar">("3d");

  if (!plant && !tool) {
    return (
      <div>
        <PageHeader title="Tidak ditemukan" back="/pindai" />
        <p className="p-4 text-muted">Konten tidak ada.</p>
      </div>
    );
  }

  const title = plant ? plant.namaLokal : tool!.nama;
  const modelSrc = plant?.model3dUrl ?? tool?.model3dUrl;

  return (
    <div>
      <PageHeader title={title} back="/pindai" />
      <div className="space-y-4 p-4">
        <div className="h-72 overflow-hidden rounded-2xl border border-line">
          {mode === "3d" ? (
            <ModelViewer src={modelSrc} className="h-full w-full" />
          ) : (
            <ARScene
              modelSrc={modelSrc ?? "/models/plant.glb"}
              targetSrc={plant?.arTargetUrl ?? "/ar/targets.mind"}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={mode === "3d" ? "primary" : "outline"}
            onClick={() => setMode("3d")}
          >
            <Box className="h-4 w-4" /> Lihat 3D
          </Button>
          <Button
            variant={mode === "ar" ? "primary" : "outline"}
            onClick={() => setMode("ar")}
          >
            <Camera className="h-4 w-4" /> Mode AR
          </Button>
        </div>

        {mode === "ar" && (
          <p className="text-center text-xs text-muted">
            Arahkan kamera ke kartu NATURA. Butuh aset target &amp; model — lihat
            public/ar/README.md.
          </p>
        )}

        {plant ? <PlantInfo plant={plant} /> : <ToolInfo tool={tool!} />}
      </div>
    </div>
  );
}
