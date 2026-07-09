import Link from "next/link";
import { library } from "@/lib/data/library";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Download } from "lucide-react";

export default function Library() {
  return (
    <div>
      <PageHeader title="Library" />
      <div className="space-y-3 p-4">
        {library.map((item) => (
          <Link key={item.id} href={`/library/${item.id}`} className="block">
            <Card className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge tone="primary">{item.tipe}</Badge>
                {item.offline && (
                  <Badge tone="success">
                    <Download className="mr-1 h-3 w-3" /> Offline
                  </Badge>
                )}
              </div>
              <div className="font-bold">{item.judul}</div>
              <p className="text-sm text-muted">{item.ringkasan}</p>
              <div className="text-xs text-muted">{item.penulis}</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
