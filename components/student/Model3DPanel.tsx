import ModelViewerLazy from "@/components/three/ModelViewerLazy";
import { buttonClass } from "@/components/ui/Button";
import { Camera } from "lucide-react";

/**
 * Panel visualisasi: model 3D tampil langsung, plus tombol lompat ke kamera
 * AR bila konten punya target (.mind). Dipakai halaman detail tanaman & alat.
 */
export function Model3DPanel({
  modelSrc,
  arHref,
}: {
  modelSrc?: string;
  arHref: string | null;
}) {
  return (
    <>
      <div className="h-72 overflow-hidden rounded-2xl border border-line">
        <ModelViewerLazy src={modelSrc} className="h-full w-full" />
      </div>
      {arHref && (
        // Halaman penuh: viewer AR statis, di luar router Next.
        <a href={arHref} className={`${buttonClass("primary", "md")} w-full`}>
          <Camera className="h-4 w-4" /> Buka Mode AR (Kamera)
        </a>
      )}
    </>
  );
}
