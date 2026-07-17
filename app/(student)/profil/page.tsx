import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ProgressRing } from "@/components/charts/ProgressRing";
import { Badge } from "@/components/ui/Badge";
import { Award, Flame, Download, LogOut, ChevronRight } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { signOutAction } from "@/lib/actions/auth";

export default async function Profil() {
  const profile = await getCurrentProfile();
  const nama = profile?.nama || "Aisyah Rahma";

  return (
    <div>
      <PageHeader title="Profil" />
      <div className="space-y-5 p-4">
        <Card className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-2xl">
            🧑‍🎓
          </span>
          <div className="flex-1">
            <div className="font-bold">{nama}</div>
            <div className="text-xs text-muted">XI Farmasi A · NATURA</div>
          </div>
          <ProgressRing value={82} label="progres" size={72} />
        </Card>

        <section>
          <h2 className="mb-2 font-bold">Pencapaian</h2>
          <div className="flex gap-3">
            <Card className="flex-1 text-center">
              <Award className="mx-auto h-6 w-6 text-accent" />
              <div className="mt-1 text-lg font-bold">6</div>
              <div className="text-xs text-muted">Badge</div>
            </Card>
            <Card className="flex-1 text-center">
              <Flame className="mx-auto h-6 w-6 text-accent" />
              <div className="mt-1 text-lg font-bold">4</div>
              <div className="text-xs text-muted">Hari streak</div>
            </Card>
            <Card className="flex-1 text-center">
              <div className="text-2xl">🌿</div>
              <div className="mt-1 text-lg font-bold">5</div>
              <div className="text-xs text-muted">Tanaman</div>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="mb-2 font-bold">Tersimpan Offline</h2>
          <Card className="divide-y divide-line p-0">
            {["Pengantar Simplisia", "Tahapan Pembuatan Simplisia"].map((t) => (
              <div key={t} className="flex items-center gap-3 p-3">
                <Download className="h-4 w-4 text-success" />
                <span className="flex-1 text-sm">{t}</span>
                <Badge tone="success">Siap offline</Badge>
              </div>
            ))}
          </Card>
        </section>

        <form action={signOutAction} className="block">
          <button type="submit" className="block w-full text-left">
            <Card className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-muted" />
              <span className="flex-1 text-sm font-medium">Keluar</span>
              <ChevronRight className="h-4 w-4 text-muted" />
            </Card>
          </button>
        </form>
      </div>
    </div>
  );
}
