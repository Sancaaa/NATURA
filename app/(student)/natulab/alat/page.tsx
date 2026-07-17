import { getTools } from "@/lib/db/tools";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ToolCard } from "@/components/student/ContentCards";

export default async function VisualisasiAlat() {
  const tools = await getTools();
  return (
    <div>
      <PageHeader title="Alat Laboratorium" back="/natulab" />
      <div className="p-4">
        {tools.length === 0 ? (
          <Card className="border-dashed text-sm text-muted">
            Belum ada data alat laboratorium.
          </Card>
        ) : (
          <div className="space-y-3">
            {tools.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
