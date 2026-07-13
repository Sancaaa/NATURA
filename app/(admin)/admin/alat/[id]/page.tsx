import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getToolDb } from "@/lib/db/tools";
import { ToolForm } from "@/components/admin/ToolForm";

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
        <h1 className="text-2xl font-extrabold">Edit Alat</h1>
        <p className="text-sm text-muted">
          ID konten: <code className="text-xs">{tool.id}</code>
        </p>
      </div>
      <ToolForm tool={tool} />
    </div>
  );
}
