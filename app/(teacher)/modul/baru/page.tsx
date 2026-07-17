import Link from "next/link";
import { LibraryForm } from "@/components/admin/LibraryForm";
import { ArrowLeft } from "lucide-react";

export default function ModulBaru() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/modul"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> Modul Materi
        </Link>
        <h1 className="text-2xl font-extrabold">Modul baru</h1>
        <p className="text-sm text-muted">
          Modul yang kamu buat langsung tampil di NatuLearn siswa.
        </p>
      </div>
      <LibraryForm returnTo="/modul" />
    </div>
  );
}
