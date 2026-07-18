"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

interface StageProps extends React.HTMLAttributes<HTMLDivElement> {
  scene?: string;
}

// Panggung 2D bersama untuk primitif berbasis-scene (tap-target, drag-drop).
// Rasio tetap 4:3 + koordinat anak dalam PERSEN → responsif di layar mana pun.
// Menggambar "meja lab" + kaca preparat sebagai konteks; di produksi bisa
// diganti gambar `scene` sungguhan sebagai background.
export const Stage = forwardRef<HTMLDivElement, StageProps>(
  function Stage({ className, scene, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full select-none touch-none overflow-hidden rounded-2xl border border-line",
          className,
        )}
        style={{
          aspectRatio: "4 / 3",
          background: scene
            ? `url(${scene}) center/cover no-repeat`
            : "radial-gradient(120% 100% at 50% 0%, #f3f5fb 0%, #e6e9f4 55%, #dadeee 100%)",
        }}
        {...props}
      >
        {/* Kaca preparat (glass slide) */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[46%] w-[62%] -translate-x-1/2 -translate-y-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/preparat.png" alt="kaca preparat" className="h-full w-full object-contain drop-shadow-sm opacity-90" />
        </div>
        {children}
      </div>
    );
  },
);
