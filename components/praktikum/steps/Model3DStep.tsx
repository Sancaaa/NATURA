"use client";

import { useState } from "react";
import ModelViewerLazy from "@/components/three/ModelViewerLazy";
import { Button } from "@/components/ui/Button";
import { Box } from "lucide-react";
import type { Model3DStep as Step, StepProps } from "@/lib/praktikum/types";

// Primitif [hybrid]: amati objek 3D sebagai SATU langkah. Membungkus
// ModelViewer.tsx (three.js) yang sudah ada — inilah jembatan 2D↔3D dalam
// mesin data-driven yang sama. `arTargetUrl` disediakan untuk varian marker-AR
// (halaman A-Frame statis terpisah) — belum diwire di sini.
export function Model3DStep({ step, onComplete }: StepProps<Step>) {
  // Guard: pratinjau 3D butuh WebGL. Bila tak tersedia, jangan crash langkah.
  const [webgl] = useState(
    () =>
      typeof document !== "undefined" &&
      !!(
        document.createElement("canvas").getContext("webgl") ||
        document.createElement("canvas").getContext("experimental-webgl")
      ),
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center text-sm text-muted">{step.instruksi}</p>

      <div
        className="relative w-full overflow-hidden rounded-2xl border border-line"
        style={{ aspectRatio: "4 / 3" }}
      >
        {webgl ? (
          <>
            <ModelViewerLazy
              src={step.modelUrl || undefined}
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1 text-[11px] text-white">
              Seret untuk memutar · cubit untuk zoom
            </div>
          </>
        ) : (
          <div className="grid h-full place-items-center text-muted">
            <div className="flex flex-col items-center gap-2">
              <Box className="h-8 w-8" />
              <span className="text-xs">Pratinjau 3D perlu WebGL</span>
            </div>
          </div>
        )}
      </div>

      <Button className="w-full max-w-xs" onClick={onComplete}>
        <Box className="h-4 w-4" /> Lanjut
      </Button>
    </div>
  );
}
