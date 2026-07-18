"use client";

import { useRef, useState } from "react";
import { Stage } from "./Stage";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { CheckCircle2 } from "lucide-react";
import type { TapTargetStep as Step, StepProps } from "@/lib/praktikum/types";

// Primitif: ketuk SATU titik benar pada scene (mis. teteskan pipet).
// Satu kode untuk semua langkah "ketuk di sini" di skenario mana pun.
export function TapTargetStep({ step, onComplete }: StepProps<Step>) {
  const ref = useRef<HTMLDivElement>(null);
  const [hit, setHit] = useState(false);
  const [miss, setMiss] = useState(false);

  const { x, y, r } = step.hotspot; // persen 0-100 (r = jari-jari, % lebar)

  function handleClick(e: React.MouseEvent) {
    if (hit) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + (x / 100) * rect.width;
    const cy = rect.top + (y / 100) * rect.height;
    const rpx = (r / 100) * rect.width;
    if (Math.hypot(e.clientX - cx, e.clientY - cy) <= rpx) {
      setHit(true);
      setMiss(false);
    } else {
      setMiss(true);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center text-sm text-muted">{step.instruksi}</p>

      <Stage
        ref={ref}
        scene={step.scene}
        onClick={handleClick}
        className={cn(!hit && "cursor-pointer")}
      >
        {/* Indikator titik target */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${x}%`, top: `${y}%`, width: `${r * 2}%`, aspectRatio: "1" }}
        >
          {hit ? (
            <span className="absolute inset-0 grid place-items-center rounded-full bg-success/25">
              <CheckCircle2 className="h-1/2 w-1/2 text-success" />
            </span>
          ) : (
            <>
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
              <span className="absolute inset-[22%] rounded-full border-2 border-primary bg-primary/20" />
            </>
          )}
        </div>
      </Stage>

      <div className="h-4 text-xs">
        {hit ? (
          <span className="text-success">{step.feedbackBenar ?? "Tepat!"}</span>
        ) : miss ? (
          <span className="text-danger">
            Belum tepat - ketuk titik yang berdenyut.
          </span>
        ) : null}
      </div>

      <Button
        className="w-full max-w-xs"
        disabled={!hit}
        onClick={onComplete}
      >
        <CheckCircle2 className="h-4 w-4" /> Lanjut
      </Button>
    </div>
  );
}
