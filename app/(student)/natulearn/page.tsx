import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getStudentAssignments } from "@/lib/db/classroom";
import { CalendarCheck, BookOpen, ClipboardList, ChevronRight } from "lucide-react";

export default async function NatuLearn() {
  const tugas = await getStudentAssignments();
  const belum = tugas.filter((t) => t.status !== "selesai").length;

  const menu = [
    {
      href: "/natulearn/kuis-harian",
      label: "Kuis Harian",
      desc: "Satu kuis baru tiap hari",
      icon: CalendarCheck,
      tone: "bg-primary/10 text-primary",
      badge: null as string | null,
    },
    {
      href: "/natulearn/modul",
      label: "Modul Materi",
      desc: "Bacaan & berkas pendukung",
      icon: BookOpen,
      tone: "bg-primary/10 text-primary",
      badge: null,
    },
    {
      href: "/natulearn/tugas",
      label: "Tugas dari Guru",
      desc: "Bobot, tenggat, dan status",
      icon: ClipboardList,
      tone: "bg-accent/15 text-accent",
      badge: belum > 0 ? `${belum} belum` : null,
    },
  ];

  return (
    <div>
      <PageHeader title="NatuLearn" />
      <div className="space-y-3 p-4">
        <p className="text-sm text-muted">
          Belajar terarah: latihan harian, materi, dan tugas dari gurumu.
        </p>
        {menu.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.href} href={m.href} className="block">
              <Card className="flex items-center gap-3">
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${m.tone}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold">{m.label}</span>
                  <span className="block text-xs text-muted">{m.desc}</span>
                </span>
                {m.badge && <Badge tone="accent">{m.badge}</Badge>}
                <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
