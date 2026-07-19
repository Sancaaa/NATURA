import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react"; // Mengganti ArrowUpRight dengan ExternalLink
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

// Menyesuaikan ketebalan border kiri agar melengkung sempurna mengikuti kontainer
const borderByStatus = {
  terlambat: "border-l-[6px] border-l-danger",
  selesai: "border-l-[6px] border-l-success",
  belum: "border-l-[6px] border-l-accent",
} as const;

/** Kartu tugas dengan desain baru sesuai gambar referensi */
export function TugasCard({ tugas }: { tugas: StudentAssignment }) {
  return (
    <Link
      href={`/natulearn/tugas/${tugas.assignmentId}`}
      className="group block"
    >
      <Card
        className={`flex items-center justify-between gap-3 p-3 rounded-2xl border border-line/60 bg-surface ${borderByStatus[tugas.status]} transition group-hover:shadow-card-hover`}
      >
        {/* Sisi Kiri: Gambar dan Detail Informasi */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Wadah Gambar Tambahan (Menggantikan Emoji 🧪) */}
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[1.5rem] bg-muted/10 border border-line/40">
            {/* SILAHKAN GANTI URL DI BAWAH INI DENGAN LINK GAMBAR ANDA */}
            <img
              src="/images/assignmentPreview.png"
              alt={tugas.judul}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Konten Teks */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold tracking-tight text-foreground">
              {tugas.judul}
            </h3>
            <p className="truncate text-xs text-muted/80 mt-1">
              {tugas.kelas || "Tugas guru"}
              {tugas.topik ? ` · ${tugas.topik}` : ""}
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700 transition">
              Detail <ExternalLink className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Sisi Kanan: Status Badge */}
        <div className="shrink-0 pl-2">
          <StatusTugasBadge status={tugas.status} />
        </div>
      </Card>
    </Link>
  );
}
