import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatusTugasBadge } from "@/components/student/StatusTugasBadge";
import type { LibraryItem } from "@/lib/db/library";
import type { StudentAssignment } from "@/lib/db/classroom";

/** Kartu materi/modul dengan tombol panah bulat (gaya referensi). */
export function ModulCard({ item }: { item: LibraryItem }) {
  return (
    <Link href={`/natulearn/modul/${item.id}`} className="group block">
      <Card className="relative transition group-hover:shadow-card-hover">
        <Badge tone="primary" className="uppercase tracking-wide">
          {item.tipe}
        </Badge>
        <h3 className="mt-2.5 pr-12 font-bold leading-snug">{item.judul}</h3>
        {item.ringkasan && (
          <p className="mt-1.5 line-clamp-2 pr-12 text-sm leading-relaxed text-muted">
            {item.ringkasan}
          </p>
        )}
        <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-primary text-white transition group-hover:bg-primary-dark">
          <ArrowRight className="h-4 w-4" />
        </span>
      </Card>
    </Link>
  );
}

const borderByStatus = {
  terlambat: "border-l-danger",
  selesai: "border-l-success",
  belum: "border-l-accent",
} as const;

/** Kartu tugas dengan tepi kiri berwarna sesuai status (gaya referensi). */
export function TugasCard({ tugas }: { tugas: StudentAssignment }) {
  return (
    <Link
      href={`/natulearn/tugas/${tugas.assignmentId}`}
      className="group block"
    >
      <Card
        className={`flex items-center gap-3 border-l-[5px] ${borderByStatus[tugas.status]} transition group-hover:shadow-card-hover`}
      >
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-2xl">
          🧪
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-bold">{tugas.judul}</div>
          <div className="truncate text-xs text-muted">
            {tugas.kelas || "Tugas guru"}
            {tugas.topik ? ` · ${tugas.topik}` : ""}
          </div>
          <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-primary">
            Detail <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
        <StatusTugasBadge status={tugas.status} />
      </Card>
    </Link>
  );
}
