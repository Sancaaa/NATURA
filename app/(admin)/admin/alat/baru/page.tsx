import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ToolForm } from "@/components/admin/ToolForm";

export default function AlatBaru() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/alat"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali
        </Link>
        <h1 className="text-2xl font-extrabold">Tambah Alat</h1>
      </div>
      <ToolForm />
    </div>
  );
}
