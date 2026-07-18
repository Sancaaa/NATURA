import { NextResponse } from "next/server";
import { getPlantDb } from "@/lib/db/plants";
import { getToolDb } from "@/lib/db/tools";
import { getAnnotations, type SubjectType } from "@/lib/db/annotations";

/**
 * Data untuk viewer AR (public/ar/viewer.html): aset + info umum + titik
 * highlight. Dipanggil dari halaman statis via fetch().
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  const { type, id } = await params;
  if (type !== "plant" && type !== "tool") {
    return NextResponse.json({ error: "Tipe tidak valid." }, { status: 400 });
  }
  const subject = type as SubjectType;

  let general = { badge: "", title: "", body: "" };
  let model: string | undefined;
  let target: string | undefined;

  if (subject === "plant") {
    const p = await getPlantDb(id);
    if (!p)
      return NextResponse.json({ error: "Tidak ditemukan." }, { status: 404 });
    general = {
      badge: p.namaLatin,
      title: p.namaLokal,
      body: p.arIntro || p.khasiat || `${p.namaLokal} - ${p.namaLatin}.`,
    };
    model = p.model3dUrl;
    target = p.arTargetUrl;
  } else {
    const t = await getToolDb(id);
    if (!t)
      return NextResponse.json({ error: "Tidak ditemukan." }, { status: 404 });
    general = {
      badge: "Alat Laboratorium",
      title: t.nama,
      body: t.arIntro || t.fungsi || t.nama,
    };
    model = t.model3dUrl;
    target = t.arTargetUrl;
  }

  const annotations = await getAnnotations(subject, id);

  return NextResponse.json(
    { model, target, general, annotations },
    { headers: { "Cache-Control": "no-store" } },
  );
}
