import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import type { TugasStatus } from "@/lib/db/classroom";

const TONE = {
  selesai: { tone: "success", label: "Selesai", Icon: CheckCircle2 },
  terlambat: { tone: "danger", label: "Terlambat", Icon: AlertTriangle },
  belum: { tone: "accent", label: "Belum dikerjakan", Icon: Clock },
} as const;

/** Badge status tugas - satu sumber tampilan untuk daftar & detail. */
export function StatusTugasBadge({ status }: { status: TugasStatus }) {
  const s = TONE[status];
  const Icon = s.Icon;
  return (
    <Badge tone={s.tone}>
      <Icon className="mr-1 h-3 w-3" />
      {s.label}
    </Badge>
  );
}
