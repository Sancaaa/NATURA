import Link from "next/link";
import { getTools } from "@/lib/db/tools";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { DeleteContentButton } from "@/components/admin/DeleteContentButton";
import { Pencil, Plus } from "lucide-react";

export default async function AdminAlat() {
  const tools = await getTools();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold">Kelola Alat Lab</h1>
          <p className="text-sm text-muted">
            Alat laboratorium yang tampil di menu Pindai & Jelajah 3D.
          </p>
        </div>
        <Link href="/admin/alat/baru" className={buttonClass("primary", "md")}>
          <Plus className="h-4 w-4" /> Tambah Alat
        </Link>
      </div>

      {tools.length === 0 ? (
        <Card className="text-sm text-muted">Belum ada alat.</Card>
      ) : (
        <div className="space-y-2">
          {tools.map((t) => (
            <Card key={t.id} className="flex flex-wrap items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-2xl">
                ⚗️
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{t.nama}</div>
                <div className="truncate text-xs text-muted">{t.fungsi}</div>
              </div>
              {t.model3dUrl && <Badge tone="primary">3D</Badge>}
              {t.arTargetUrl && <Badge tone="accent">AR</Badge>}
              <Link
                href={`/admin/alat/${t.id}`}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
              >
                <Pencil className="h-4 w-4" /> Edit
              </Link>
              <DeleteContentButton kind="tool" id={t.id} nama={t.nama} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
