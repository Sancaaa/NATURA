import Link from "next/link";
import { cn } from "@/lib/cn";

/** Judul seksi + tautan "Lihat Semua" opsional (gaya referensi). */
export function SectionHeader({
  title,
  href,
  action = "Lihat Semua",
  className,
}: {
  title: string;
  href?: string;
  action?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-center justify-between", className)}>
      <h2 className="text-lg font-bold">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-sm font-semibold text-primary hover:underline"
        >
          {action}
        </Link>
      )}
    </div>
  );
}
