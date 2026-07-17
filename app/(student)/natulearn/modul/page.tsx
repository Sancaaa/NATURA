import Link from "next/link";
import { getLibrary } from "@/lib/db/library";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Download, Paperclip } from "lucide-react";

export default async function ModulMateri() {
  const library = await getLibrary();
  return (
    <div>
      <PageHeader title="Modul Materi" back="/natulearn" />
      <div className="space-y-3 p-4">
        {library.length === 0 ? (
          <Card className="border-dashed text-sm text-muted">
            Belum ada materi.
          </Card>
        ) : (
          library.map((item) => (
            <Link
              key={item.id}
              href={`/natulearn/modul/${item.id}`}
              className="block"
            >
              <Card className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="primary">{item.tipe}</Badge>
                  {item.offline && (
                    <Badge tone="success">
                      <Download className="mr-1 h-3 w-3" /> Offline
                    </Badge>
                  )}
                  {item.lampiran.length > 0 && (
                    <Badge tone="muted">
                      <Paperclip className="mr-1 h-3 w-3" />
                      {item.lampiran.length}
                    </Badge>
                  )}
                </div>
                <div className="font-bold">{item.judul}</div>
                <p className="text-sm text-muted">{item.ringkasan}</p>
                <div className="text-xs text-muted">{item.penulis}</div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
