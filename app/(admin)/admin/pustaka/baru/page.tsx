import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { LibraryForm } from "@/components/admin/LibraryForm";

export default function PustakaBaru() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/pustaka"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali
        </Link>
        <h1 className="text-2xl font-extrabold">Tambah Pustaka</h1>
      </div>
      <LibraryForm />
    </div>
  );
}
