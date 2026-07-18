import Link from "next/link";
import { getMyQuizzes } from "@/lib/db/quizzes";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { DeleteQuizButton } from "@/components/teacher/DeleteQuizButton";
import { Pencil, Plus } from "lucide-react";

export default async function BankSoal() {
  const quizzes = await getMyQuizzes();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold">Bank Soal</h1>
          <p className="text-sm text-muted">
            Kuis buatan Anda - edit atau hapus di sini.
          </p>
        </div>
        <Link href="/buat-kuis" className={buttonClass("primary", "md")}>
          <Plus className="h-4 w-4" /> Buat Kuis
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <Card className="text-sm text-muted">
          Belum ada kuis. Buat lewat{" "}
          <Link href="/buat-kuis" className="font-semibold text-primary">
            Buat Kuis
          </Link>
          .
        </Card>
      ) : (
        <div className="space-y-2">
          {quizzes.map((q) => (
            <Card key={q.id} className="flex flex-wrap items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{q.judul}</div>
                <div className="text-xs text-muted">
                  {q.jumlahSoal} soal{q.topik ? ` · ${q.topik}` : ""}
                </div>
              </div>
              {q.sumber === "generated" && <Badge tone="primary">AI</Badge>}
              <Link
                href={`/bank-soal/${q.id}/edit`}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
              >
                <Pencil className="h-4 w-4" /> Edit
              </Link>
              <DeleteQuizButton quizId={q.id} judul={q.judul} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
