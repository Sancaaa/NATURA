import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PageHeader({ title, back }: { title: string; back?: string }) {
  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-line bg-surface/95 px-4 py-3 backdrop-blur">
      {back && (
        <Link href={back} aria-label="Kembali" className="text-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      )}
      <h1 className="text-base font-bold">{title}</h1>
    </header>
  );
}
