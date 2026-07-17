import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, MapPin } from "lucide-react";
import { getToolDb } from "@/lib/db/tools";
import { ToolForm } from "@/components/admin/ToolForm";
import { buttonClass } from "@/components/ui/Button";

export default async function AlatEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tool = await getToolDb(id);
  if (!tool) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/alat"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-extrabold">Edit Alat</h1>
          <Link
            href={`/admin/alat/${id}/titik`}
            className={`${buttonClass("outline", "sm")} ml-auto`}
          >
            <MapPin className="h-4 w-4" /> Kelola Titik AR
          </Link>
        </div>
        <p className="text-sm text-muted">
          ID konten: <code className="text-xs">{tool.id}</code>
        </p>
      </div>
      <ToolForm tool={tool} />
    </div>
  );
}
