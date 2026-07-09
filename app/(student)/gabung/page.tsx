import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { JoinClassForm } from "@/components/student/JoinClassForm";

export default function Gabung() {
  return (
    <div>
      <PageHeader title="Gabung Kelas" back="/beranda" />
      <div className="p-4">
        <Card className="space-y-3">
          <p className="text-sm text-muted">
            Masukkan kode kelas dari gurumu untuk bergabung dan menerima tugas.
          </p>
          <JoinClassForm />
        </Card>
      </div>
    </div>
  );
}
