import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { SAMPLE_SCENARIOS } from "@/lib/praktikum/samples";
import { Microscope, ChevronRight } from "lucide-react";

// Sumber skenario masih literal (lib/praktikum/samples.ts). Saat tabel
// `scenarios` sudah ada, ganti baris `list = ...` dengan query DB —
// PraktikumRunner tidak berubah.
export default function PraktikumList() {
  const list = Object.values(SAMPLE_SCENARIOS);

  return (
    <div>
      <PageHeader title="Simulasi Praktikum" back="/natulab" />
      <div className="space-y-3 p-4">
        <p className="text-sm text-muted">
          Coba praktikum virtual bertahap — dari menyiapkan preparat sampai
          mengamati hasilnya.
        </p>
        {list.length === 0 ? (
          <Card className="border-dashed text-sm text-muted">
            Belum ada skenario praktikum.
          </Card>
        ) : (
          list.map((s) => (
            <Link
              key={s.id}
              href={`/natulab/praktikum/${s.id}`}
              className="block"
            >
              <Card className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                  <Microscope className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{s.judul}</span>
                  <span className="block text-xs text-muted">
                    {s.steps.length} langkah
                    {s.deskripsi ? ` · ${s.deskripsi}` : ""}
                  </span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
