"use client";

import { Button } from "@/components/ui/Button";
import { Eye } from "lucide-react";
import type { ObserveStep as Step, StepProps } from "@/lib/praktikum/types";

// Primitif: amati hasil (gambar/animasi), lalu lanjut. Tanpa syarat lulus -
// murni pengamatan. `media` kosong → placeholder (berguna untuk prototype).
export function ObserveStep({ step, onComplete }: StepProps<Step>) {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center text-sm text-muted">{step.instruksi}</p>

      <div
        className="relative w-full overflow-hidden rounded-2xl border border-line bg-black/5"
        style={{ aspectRatio: "4 / 3" }}
      >
        {step.media ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={step.media}
            alt="Media pengamatan"
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="grid h-full place-items-center text-muted">
            <div className="flex flex-col items-center gap-2">
              <Eye className="h-8 w-8" />
              <span className="text-xs">media pengamatan</span>
            </div>
          </div>
        )}
      </div>

      <div className="h-4 text-xs">
        {step.feedbackBenar && (
          <span className="text-success">{step.feedbackBenar}</span>
        )}
      </div>

      <Button className="w-full max-w-xs" onClick={onComplete}>
        Selesai mengamati
      </Button>
    </div>
  );
}
