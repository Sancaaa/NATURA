import { notFound } from "next/navigation";
import { getLibraryItemDb } from "@/lib/db/library";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";

export default async function Read({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getLibraryItemDb(id);
  if (!item) notFound();

  return (
    <div>
      <PageHeader title={item.tipe} back="/library" />
      <article className="space-y-4 p-4">
        <div className="flex items-center gap-2">
          <Badge tone="primary">{item.tipe}</Badge>
          {item.offline && <Badge tone="success">Tersedia offline</Badge>}
        </div>
        <h1 className="text-2xl font-extrabold leading-tight">{item.judul}</h1>
        <div className="text-sm text-muted">{item.penulis}</div>
        <div className="space-y-3 leading-relaxed">
          {item.konten.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>
    </div>
  );
}
