"use client";

import { Button } from "@/components/ui/Button";
import type { InfoStep as Step, StepProps } from "@/lib/praktikum/types";

// Primitif paling sederhana: layar teks (intro / transisi / hasil).
export function InfoStep({ step, onComplete }: StepProps<Step>) {
  return (
    <div className="flex flex-col gap-4 text-center">
      <p className="text-sm font-semibold text-ink">{step.instruksi}</p>
      {step.body && (
        <p className="text-sm leading-relaxed text-muted">{step.body}</p>
      )}
      <Button className="mt-2 w-full" onClick={onComplete}>
        {step.lanjutLabel ?? "Lanjut"}
      </Button>
    </div>
  );
}
