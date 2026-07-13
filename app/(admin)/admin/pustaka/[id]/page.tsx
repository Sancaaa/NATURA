import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getLibraryItemDb } from "@/lib/db/library";
import { LibraryForm } from "@/components/admin/LibraryForm";

export default async function PustakaEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getLibraryItemDb(id);
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/pustaka"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali
        </Link>
        <h1 className="text-2xl font-extrabold">Edit Pustaka</h1>
        <p className="text-sm text-muted">
          ID konten: <code className="text-xs">{item.id}</code>
        </p>
      </div>
      <LibraryForm item={item} />
    </div>
  );
}
