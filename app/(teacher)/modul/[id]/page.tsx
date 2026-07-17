import Link from "next/link";
import { notFound } from "next/navigation";
import { getLibraryItemDb } from "@/lib/db/library";
import { getCurrentProfile } from "@/lib/auth";
import { LibraryForm } from "@/components/admin/LibraryForm";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AttachmentList } from "@/components/ui/AttachmentList";
import { ArrowLeft } from "lucide-react";

/**
 * Sunting modul bila guru pemiliknya (atau admin); selain itu pratinjau
 * read-only. Batas sebenarnya tetap ditegakkan RLS `library_write` —
 * pengecekan di sini hanya agar UI tidak menawarkan yang akan ditolak.
 */
export default async function ModulEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, me] = await Promise.all([
    getLibraryItemDb(id),
    getCurrentProfile(),
  ]);
  if (!item) notFound();

  const bisaUbah =
    me?.role === "admin" || (!!me && item.createdBy === me.id);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/modul"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> Modul Materi
        </Link>
        <h1 className="text-2xl font-extrabold">
          {bisaUbah ? "Sunting modul" : item.judul}
        </h1>
        {!bisaUbah && (
          <p className="text-sm text-muted">
            Dibuat guru lain atau admin — hanya bisa dilihat.
          </p>
        )}
      </div>

      {bisaUbah ? (
        <LibraryForm item={item} returnTo="/modul" />
      ) : (
        <article className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge tone="primary">{item.tipe}</Badge>
            {item.offline && <Badge tone="success">Tersedia offline</Badge>}
          </div>
          <div className="text-sm text-muted">{item.penulis}</div>
          <Card className="space-y-3 leading-relaxed">
            {item.konten.length === 0 ? (
              <p className="text-sm text-muted">Belum ada konten.</p>
            ) : (
              item.konten.map((p, i) => <p key={i}>{p}</p>)
            )}
          </Card>
          <AttachmentList items={item.lampiran} />
        </article>
      )}
    </div>
  );
}
