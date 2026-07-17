"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { CheckCircle2 } from "lucide-react";
import type { SliderRevealStep as Step, StepProps } from "@/lib/praktikum/types";

// Primitif: fokus mikroskop. Geser slider hingga nilainya masuk rentang
// `target` → spesimen berubah dari buram ke tajam. Ini satu-satunya kode
// yang ditulis untuk SEMUA langkah "putar fokus" di skenario mana pun.
export function SliderRevealStep({ step, onComplete }: StepProps<Step>) {
  const mid = Math.round((step.target[0] + step.target[1]) / 2);
  // mulai dari titik terjauh dari fokus supaya awalnya benar-benar buram.
  const [value, setValue] = useState(
    mid - step.min > step.max - mid ? step.min : step.max,
  );

  const [lo, hi] = step.target;
  const inFocus = value >= lo && value <= hi;

  // Jarak dari rentang fokus → seberapa buram (px). 0 saat fokus.
  const dist = inFocus ? 0 : Math.min(Math.abs(value - lo), Math.abs(value - hi));
  const span = Math.max(1, step.max - step.min);
  const blurPx = Math.min(12, (dist / span) * 40);

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-center text-sm text-muted">{step.instruksi}</p>

      {/* "Lensa" mikroskop — lingkaran gelap dengan spesimen di dalamnya. */}
      <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-full bg-[#0d130f] shadow-inner ring-4 ring-black/20">
        <div
          className="absolute inset-0 transition-[filter] duration-150"
          style={{ filter: `blur(${blurPx.toFixed(2)}px)` }}
        >
          {step.specimen ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={step.specimen}
              alt="Spesimen mikroskop"
              className="h-full w-full object-cover"
            />
          ) : (
            <SpecimenPlaceholder />
          )}
        </div>

        {/* Vignette lensa */}
        <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_60px_20px_rgba(0,0,0,0.55)]" />

        {inFocus && step.caption && (
          <div className="absolute inset-x-0 bottom-3 mx-auto w-[85%] rounded-lg bg-black/60 px-3 py-1.5 text-center text-[11px] font-medium text-white">
            {step.caption}
          </div>
        )}
      </div>

      {/* Slider = makrometer/pemutar fokus */}
      <div className="w-full max-w-xs">
        <div className="mb-1 flex justify-between text-[11px] text-muted">
          <span>Buram</span>
          <span>Pemutar fokus</span>
          <span>Tajam</span>
        </div>
        <input
          type="range"
          min={step.min}
          max={step.max}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full accent-primary"
          aria-label="Pemutar fokus mikroskop"
        />
      </div>

      <button
        type="button"
        disabled={!inFocus}
        onClick={onComplete}
        className={cn(
          "inline-flex h-11 w-full max-w-xs items-center justify-center gap-2 rounded-xl font-semibold text-white transition disabled:opacity-40",
          inFocus ? "bg-success" : "bg-primary",
        )}
      >
        <CheckCircle2 className="h-4 w-4" />
        {inFocus ? (step.feedbackBenar ?? "Gambar tajam — lanjut") : "Cari fokus dulu…"}
      </button>
    </div>
  );
}

// Spesimen sel amilum sederhana (SVG) — supaya prototype jalan tanpa aset.
// Di produksi, `step.specimen` menunjuk gambar mikroskopis asli.
function SpecimenPlaceholder() {
  const grains = [
    { cx: 38, cy: 42, r: 15, rot: -20 },
    { cx: 64, cy: 58, r: 12, rot: 30 },
    { cx: 52, cy: 30, r: 9, rot: 10 },
    { cx: 30, cy: 66, r: 11, rot: -40 },
    { cx: 70, cy: 36, r: 8, rot: 15 },
  ];
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <rect width="100" height="100" fill="#c9b98f" />
      {grains.map((g, i) => (
        <g key={i} transform={`rotate(${g.rot} ${g.cx} ${g.cy})`}>
          {/* butir pati: elips konsentris + hilus (titik tengah) */}
          <ellipse cx={g.cx} cy={g.cy} rx={g.r} ry={g.r * 0.72} fill="#efe6cf" stroke="#a9915c" strokeWidth="0.8" />
          <ellipse cx={g.cx} cy={g.cy} rx={g.r * 0.6} ry={g.r * 0.43} fill="none" stroke="#c0a877" strokeWidth="0.6" />
          <circle cx={g.cx} cy={g.cy} r="1.3" fill="#7a6534" />
        </g>
      ))}
    </svg>
  );
}
