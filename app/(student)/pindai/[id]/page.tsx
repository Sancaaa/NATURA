import { redirect, notFound } from "next/navigation";
import { getPlantDb } from "@/lib/db/plants";
import { getToolDb } from "@/lib/db/tools";

/**
 * Resolver tautan lama. Rute visualisasi kini terpisah per jenis
 * (/natulab/tanaman/[id] & /natulab/alat/[id]), sedangkan id sendiri tidak
 * menyiratkan jenisnya - jadi redirect statis di next.config tidak cukup.
 * Halaman ini menentukan jenisnya lalu meneruskan.
 */
export default async function PindaiResolver({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plant = await getPlantDb(id);
  if (plant) redirect(`/natulab/tanaman/${id}`);

  const tool = await getToolDb(id);
  if (tool) redirect(`/natulab/alat/${id}`);

  notFound();
}
