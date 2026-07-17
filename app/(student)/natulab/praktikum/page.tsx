import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { PraktikumCard } from "@/components/student/ContentCards";
import { SAMPLE_SCENARIOS } from "@/lib/praktikum/samples";

// Sumber skenario masih literal (lib/praktikum/samples.ts). Saat tabel
// `scenarios` sudah ada, ganti baris `list = ...` dengan query DB —
// PraktikumCard/Runner tidak berubah.
export default function PraktikumList() {
  const list = Object.values(SAMPLE_SCENARIOS);

  return (
    <div>
      <PageHeader title="Simulasi Praktikum" back="/natulab" />
      <div className="space-y-4 p-4">
        <p className="text-sm leading-relaxed text-muted">
          Coba praktikum virtual bertahap — dari menyiapkan preparat sampai
          mengamati hasilnya.
        </p>
        {list.length === 0 ? (
          <Card className="border-dashed text-sm text-muted">
            Belum ada skenario praktikum.
          </Card>
        ) : (
          list.map((s) => <PraktikumCard key={s.id} scenario={s} />)
        )}
      </div>
    </div>
  );
}
