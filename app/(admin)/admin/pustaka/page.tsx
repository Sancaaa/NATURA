import Link from "next/link";
import { getLibrary } from "@/lib/db/library";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { DeleteContentButton } from "@/components/admin/DeleteContentButton";
import { Pencil, Plus, Download } from "lucide-react";

export default async function AdminPustaka() {
  const items = await getLibrary();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold">Kelola Pustaka</h1>
          <p className="text-sm text-muted">
            Modul, artikel, dan buku yang tampil di menu Library.
          </p>
        </div>
        <Link href="/admin/pustaka/baru" className={buttonClass("primary", "md")}>
          <Plus className="h-4 w-4" /> Tambah Pustaka
        </Link>
      </div>

      {items.length === 0 ? (
        <Card className="text-sm text-muted">Belum ada pustaka.</Card>
      ) : (
        <div className="space-y-2">
          {items.map((it) => (
            <Card key={it.id} className="flex flex-wrap items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <Badge tone="primary">{it.tipe}</Badge>
                  {it.offline && (
                    <Badge tone="success">
                      <Download className="mr-1 h-3 w-3" /> Offline
                    </Badge>
                  )}
                </div>
                <div className="font-semibold">{it.judul}</div>
                <div className="truncate text-xs text-muted">
                  {it.penulis}
                  {it.ringkasan ? ` · ${it.ringkasan}` : ""}
                </div>
              </div>
              <Link
                href={`/admin/pustaka/${it.id}`}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
              >
                <Pencil className="h-4 w-4" /> Edit
              </Link>
              <DeleteContentButton kind="library" id={it.id} nama={it.judul} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
