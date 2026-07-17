"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

// Panggung 2D bersama untuk primitif berbasis-scene (tap-target, drag-drop).
// Rasio tetap 4:3 + koordinat anak dalam PERSEN → responsif di layar mana pun.
// Menggambar "meja lab" + kaca preparat sebagai konteks; di produksi bisa
// diganti gambar `scene` sungguhan sebagai background.
export const Stage = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function Stage({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full select-none touch-none overflow-hidden rounded-2xl border border-line",
          className,
        )}
        style={{
          aspectRatio: "4 / 3",
          background:
            "radial-gradient(120% 100% at 50% 0%, #f3f5fb 0%, #e6e9f4 55%, #dadeee 100%)",
        }}
        {...props}
      >
        {/* Kaca preparat (glass slide) */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[46%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-md border border-black/10 bg-white/55 shadow-sm" />
        {children}
      </div>
    );
  },
);
