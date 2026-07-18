import { notFound } from "next/navigation";
import { getStudentDetail } from "@/lib/db/classroom";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScanLine, ListChecks, BookOpen, MessageCircle } from "lucide-react";

function DemoActivity() {
  const timeline = [
    { icon: ScanLine, text: "Menjelajah AR: Sambiloto", time: "Hari ini, 09:12" },
    { icon: ListChecks, text: "Kuis Dasar Simplisia — skor 90", time: "Hari ini, 08:40" },
    { icon: BookOpen, text: "Membaca modul Pengantar Simplisia", time: "Kemarin" },
  ];
  const chat = [
    { role: "Siswa", text: "Kak, beda gingerol sama shogaol apa?" },
    {
      role: "Tutor",
      text: "Shogaol terbentuk dari gingerol saat pengeringan/pemanasan; keduanya senyawa khas jahe.",
    },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
        Data contoh — aktivitas di bawah ini bukan data siswa sesungguhnya.
      </div>
      <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <h2 className="mb-3 font-bold">Aktivitas terakhir</h2>
        <div className="space-y-3">
          {timeline.map((t, i) => {
            const Icon = t.icon;
            return (
              <div key={i} className="flex items-start gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm">{t.text}</div>
                  <div className="text-xs text-muted">{t.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <Card>
        <h2 className="mb-3 flex items-center gap-2 font-bold">
          <MessageCircle className="h-4 w-4 text-primary" /> Riwayat Tutor AI
        </h2>
        <p className="mb-3 text-xs text-muted">
          Ditampilkan untuk keamanan &amp; memahami kesulitan siswa.
        </p>
        <div className="space-y-2">
          {chat.map((c, i) => (
            <div key={i} className="rounded-xl border border-line p-3 text-sm">
              <div className="mb-1 text-xs font-semibold text-muted">
                {c.role}
              </div>
              {c.text}
            </div>
          ))}
        </div>
      </Card>
      </div>
    </div>
  );
}

export default async function SiswaDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const d = await getStudentDetail(id);
  if (!d) notFound();

  return (
    <div className="space-y-6">
      <Card className="flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-lg font-bold text-primary">
          {d.nama.charAt(0)}
        </span>
        <div className="flex-1">
          <h1 className="text-xl font-extrabold">{d.nama}</h1>
          {d.kelasNama && <p className="text-sm text-muted">{d.kelasNama}</p>}
        </div>
      </Card>

      {d.demo ? (
        <DemoActivity />
      ) : (
        <Card>
          <h2 className="mb-3 font-bold">Hasil tugas</h2>
          {d.submissions.length === 0 ? (
            <p className="text-sm text-muted">
              Belum ada tugas yang dikumpulkan.
            </p>
          ) : (
            <div className="space-y-2">
              {d.submissions.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-line p-3"
                >
                  <div className="flex-1 text-sm">{s.judul}</div>
                  <Badge tone={(s.skor ?? 0) >= 70 ? "success" : "danger"}>
                    {s.skor ?? "—"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
