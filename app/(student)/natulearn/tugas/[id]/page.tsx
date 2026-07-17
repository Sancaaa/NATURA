import Link from "next/link";
import { notFound } from "next/navigation";
import { getStudentAssignment } from "@/lib/db/classroom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { buttonClass } from "@/components/ui/Button";
import { AttachmentList } from "@/components/ui/AttachmentList";
import { StatusTugasBadge } from "@/components/student/StatusTugasBadge";
import { formatDeadline } from "@/lib/format";

export default async function DetailTugas({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getStudentAssignment(id);
  if (!t) notFound();

  return (
    <div>
      <PageHeader title="Detail Tugas" back="/natulearn/tugas" />
      <div className="space-y-4 p-4">
        <div>
          <h1 className="text-xl font-extrabold leading-tight">{t.judul}</h1>
          <p className="mt-1 text-sm text-muted">
            {t.kelas}
            {t.topik ? ` · ${t.topik}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusTugasBadge status={t.status} />
          {t.sudahDikerjakan && t.skor != null && (
            <span className="text-xs font-semibold text-success">
              Skor kamu: {t.skor}
            </span>
          )}
        </div>

        <Card className="grid grid-cols-2 gap-3 p-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">
              Bobot
            </div>
            <div className="text-sm font-semibold">{t.bobot}</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">
              Tenggat
            </div>
            <div className="text-sm font-semibold">
              {formatDeadline(t.deadline) ?? "Tanpa tenggat"}
            </div>
          </div>
        </Card>

        {t.deskripsi && (
          <section>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
              Deskripsi
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed">
              {t.deskripsi}
            </p>
          </section>
        )}

        <AttachmentList items={t.lampiran} />

        <Link
          href={`/natulearn/kuis/${t.quizId}?assignment=${t.assignmentId}`}
          className={`${buttonClass(
            t.sudahDikerjakan ? "outline" : "primary",
            "md",
          )} w-full`}
        >
          {t.sudahDikerjakan ? "Lihat / kerjakan ulang" : "Kerjakan tugas"}
        </Link>
      </div>
    </div>
  );
}
