import { notFound } from "next/navigation";
import { PraktikumRunner } from "@/components/praktikum/PraktikumRunner";
import { SAMPLE_SCENARIOS } from "@/lib/praktikum/samples";

// Sumber skenario masih dari SAMPLE_SCENARIOS (data literal). Di produksi,
// ganti baris `scenario = ...` dengan query ke tabel `scenarios`
// (mirror lib/db/quizzes.ts) - runner-nya tidak berubah.
export default async function PraktikumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scenario = SAMPLE_SCENARIOS[id];
  if (!scenario) notFound();

  return <PraktikumRunner scenario={scenario} back="/natulab/praktikum" />;
}
