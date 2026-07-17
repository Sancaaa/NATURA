import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Kartu hero biru ala referensi: ikon-chip, judul besar putih, deskripsi,
 * dan tombol pil putih. Dipakai di NatuLab (AR) & NatuLearn (Kuis Harian).
 */
export function HeroBanner({
  icon: Icon,
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  external,
  className,
}: {
  icon: LucideIcon;
  eyebrow?: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  external?: boolean;
  className?: string;
}) {
  const cta =
    ctaLabel && ctaHref ? (
      <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-primary shadow-sm transition hover:bg-white/90">
        {ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </span>
    ) : null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a49ff] to-primary-dark p-6 text-white shadow-card",
        className,
      )}
    >
      {/* Lingkaran dekoratif lembut */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-14 -left-8 h-40 w-40 rounded-full bg-white/5" />

      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur">
            <Icon className="h-6 w-6" />
          </span>
          {eyebrow && (
            <span className="text-sm font-semibold text-white/90">{eyebrow}</span>
          )}
        </div>

        <h2 className="mt-4 text-2xl font-extrabold leading-tight">{title}</h2>
        {description && (
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
            {description}
          </p>
        )}

        {cta &&
          (external ? (
            <a href={ctaHref} className="block">
              {cta}
            </a>
          ) : (
            <Link href={ctaHref!} className="block">
              {cta}
            </Link>
          ))}
      </div>
    </div>
  );
}
