"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { CheckCircle2, RotateCcw, Trophy } from "lucide-react";
import { STEP_REGISTRY } from "./registry";
import type { ScenarioDefinition } from "@/lib/praktikum/types";

// ============================================================
// ENGINE. Satu runner untuk SEMUA skenario (mirip QuizRunner untuk kuis).
// Ia berjalan melintasi `definition.steps`, menampilkan langkah aktif via
// STEP_REGISTRY, dan maju saat primitif memanggil onComplete().
// Runner TIDAK tahu isi tiap primitif — 2D atau 3D sama saja baginya.
// ============================================================
export function PraktikumRunner({
  scenario,
  back = "/natulab/praktikum",
}: {
  scenario: ScenarioDefinition;
  back?: string;
}) {
  const [index, setIndex] = useState(0);
  const steps = scenario.steps;
  const total = steps.length;
  const done = index >= total;
  const step = steps[index];

  function next() {
    // Seam produksi: simpan progres ke `scenario_attempts` di sini
    // (mirror saveQuizResult) sebelum maju. Prototype: state lokal saja.
    setIndex((i) => i + 1);
  }

  const progress = Math.round((Math.min(index, total) / total) * 100);

  return (
    <div className="min-h-screen">
      <PageHeader title={scenario.judul} back={back} />

      {/* Progress langkah */}
      <div className="px-4 pt-4">
        <div className="mb-1 flex justify-between text-[11px] text-muted">
          <span>
            Langkah {Math.min(index + 1, total)} dari {total}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="p-4">
        {done ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-surface p-8 text-center">
            <Trophy className="h-12 w-12 text-accent" />
            <div>
              <div className="text-lg font-bold text-ink">Praktikum selesai!</div>
              <p className="mt-1 text-sm text-muted">
                Kamu menyelesaikan semua langkah {scenario.judul}.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full max-w-xs"
              onClick={() => setIndex(0)}
            >
              <RotateCcw className="h-4 w-4" /> Ulangi
            </Button>
          </div>
        ) : (
          <StepHost key={step.id}>
            <StepView step={step} onComplete={next} />
          </StepHost>
        )}
      </div>
    </div>
  );
}

function StepHost({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">{children}</div>
  );
}

// Memilih komponen primitif dari registry berdasarkan `step.tipe`.
function StepView({
  step,
  onComplete,
}: {
  step: ScenarioDefinition["steps"][number];
  onComplete: () => void;
}) {
  const Comp = STEP_REGISTRY[step.tipe];

  if (!Comp) {
    // Degradasi anggun: primitif belum terdaftar → jangan crash.
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-muted">{step.instruksi}</p>
        <p
          className={cn(
            "rounded-lg bg-black/5 px-3 py-2 text-xs text-muted",
          )}
        >
          Jenis langkah <b>{step.tipe}</b> belum didukung di prototype ini.
        </p>
        <Button variant="outline" className="w-full max-w-xs" onClick={onComplete}>
          <CheckCircle2 className="h-4 w-4" /> Lewati (dummy)
        </Button>
      </div>
    );
  }

  // `step` sudah discriminated-union; komponen di registry menyempitkannya.
  return <Comp step={step as never} onComplete={onComplete} />;
}
