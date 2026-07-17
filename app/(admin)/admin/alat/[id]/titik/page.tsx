import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getToolDb } from "@/lib/db/tools";
import { getAnnotations } from "@/lib/db/annotations";
import { AnnotationsEditor } from "@/components/admin/AnnotationsEditor";
import type { AnnotationInput } from "@/lib/actions/annotations";

export default async function AlatTitik({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tool = await getToolDb(id);
  if (!tool) notFound();

  const anns = await getAnnotations("tool", id);
  const initial: AnnotationInput[] = anns.map((a) => ({
    label: a.label,
    body: a.body,
    pos: a.pos,
    labelPos: a.labelPos,
  }));

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/admin/alat/${id}`}
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali ke edit alat
        </Link>
        <h1 className="text-2xl font-extrabold">Titik Highlight AR</h1>
        <p className="text-sm text-muted">
          Kelola titik yang muncul di atas model saat kartu dipindai.
          {!tool.model3dUrl &&
            " Model 3D belum diunggah — memakai model contoh untuk penempatan."}
        </p>
      </div>

      <AnnotationsEditor
        subjectType="tool"
        subjectId={id}
        subjectName={tool.nama}
        modelSrc={tool.model3dUrl}
        initial={initial}
      />
    </div>
  );
}
