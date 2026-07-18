"use client";

import { useRef, useState } from "react";
import { Stage } from "./Stage";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { CheckCircle2, Move } from "lucide-react";
import type { DragDropStep as Step, StepProps } from "@/lib/praktikum/types";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// Primitif: seret objek A ke zona B (mis. spatula+serbuk → tetesan air).
// Pointer Events → satu jalur kode untuk mouse maupun sentuh (mobile-first).
export function DragDropStep({ step, onComplete }: StepProps<Step>) {
  const START = { x: 16, y: 84 }; // posisi awal chip (persen)
  const ref = useRef<HTMLDivElement>(null);
  const grab = useRef({ dx: 0, dy: 0 }); // offset genggaman (px) dari pusat chip
  const posRef = useRef(START); // posisi terkini - sumber kebenaran uji zona
  const draggingRef = useRef(false); // status seret - kebal render yang tertinggal
  const [pos, setPos] = useState(START); // cermin untuk render
  const [dragging, setDragging] = useState(false); // hanya untuk gaya visual
  const [done, setDone] = useState(false);

  const z = step.zone; // {x,y,w,h} persen 0-100

  function move(p: { x: number; y: number }) {
    posRef.current = p;
    setPos(p);
  }

  function pointerDown(e: React.PointerEvent) {
    if (done) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + (posRef.current.x / 100) * rect.width;
    const cy = rect.top + (posRef.current.y / 100) * rect.height;
    grab.current = { dx: e.clientX - cx, dy: e.clientY - cy };
    draggingRef.current = true;
    setDragging(true);
    // capture agar seret tetap terlacak meski jari/kursor keluar dari chip;
    // defensif - sebagian browser melempar bila pointerId tak aktif.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  }

  function pointerMove(e: React.PointerEvent) {
    if (!draggingRef.current) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - grab.current.dx - rect.left) / rect.width) * 100;
    const ny = ((e.clientY - grab.current.dy - rect.top) / rect.height) * 100;
    move({ x: clamp(nx, 0, 100), y: clamp(ny, 0, 100) });
  }

  function pointerUp() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    const p = posRef.current; // posisi terkini, bukan state yang bisa tertinggal
    const inside =
      p.x >= z.x && p.x <= z.x + z.w && p.y >= z.y && p.y <= z.y + z.h;
    if (inside) {
      move({ x: z.x + z.w / 2, y: z.y + z.h / 2 }); // snap ke tengah zona
      setDone(true);
    } else {
      move(START); // snap kembali
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center text-sm text-muted">{step.instruksi}</p>

      <Stage ref={ref} scene={step.scene}>
        {/* Zona tujuan */}
        <div
          className={cn(
            "absolute rounded-lg border-2 border-dashed transition-colors",
            done ? "border-success bg-success/10" : "border-primary/60 bg-primary/5",
          )}
          style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%` }}
        >
          {!done && (
            <span className="absolute inset-0 grid place-items-center text-[10px] font-medium text-primary/70">
              letakkan di sini
            </span>
          )}
        </div>

        {/* Objek yang diseret */}
        <div
          role="button"
          aria-label={`Seret ${step.draggable}`}
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={pointerUp}
          className={cn(
            "absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center shadow-md",
            !step.draggableImage && "gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold",
            !step.draggableImage && (done ? "border-success bg-success text-white" : "border-line bg-surface text-ink"),
            dragging ? "scale-105 cursor-grabbing" : "cursor-grab",
            !dragging && "transition-all",
          )}
          style={{ left: `${pos.x}%`, top: `${pos.y}%`, touchAction: "none" }}
        >
          {step.draggableImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={step.draggableImage} alt={step.draggable} className="h-16 object-contain pointer-events-none drop-shadow-md" />
          ) : (
            <>
              {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Move className="h-3.5 w-3.5" />}
              {step.draggable}
            </>
          )}
        </div>
      </Stage>

      <div className="h-4 text-xs">
        {done && (
          <span className="text-success">
            {step.feedbackBenar ?? "Tepat di posisinya!"}
          </span>
        )}
      </div>

      <Button className="w-full max-w-xs" disabled={!done} onClick={onComplete}>
        <CheckCircle2 className="h-4 w-4" /> Lanjut
      </Button>
    </div>
  );
}
