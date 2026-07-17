import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, MapPin } from "lucide-react";
import { getPlantDb } from "@/lib/db/plants";
import { PlantForm } from "@/components/admin/PlantForm";
import { buttonClass } from "@/components/ui/Button";

export default async function TanamanEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plant = await getPlantDb(id);
  if (!plant) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/tanaman"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-extrabold">Edit Tanaman</h1>
          <Link
            href={`/admin/tanaman/${id}/titik`}
            className={`${buttonClass("outline", "sm")} ml-auto`}
          >
            <MapPin className="h-4 w-4" /> Kelola Titik AR
          </Link>
        </div>
        <p className="text-sm text-muted">
          ID konten: <code className="text-xs">{plant.id}</code>
        </p>
      </div>
      <PlantForm plant={plant} />
    </div>
  );
}
