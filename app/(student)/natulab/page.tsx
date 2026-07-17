import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import {
  Camera,
  Leaf,
  FlaskConical,
  Microscope,
  ChevronRight,
} from "lucide-react";

const menu = [
  {
    href: "/natulab/ar",
    label: "Visualisasi AR",
    desc: "Arahkan kamera ke kartu NATURA",
    icon: Camera,
    tone: "bg-primary/10 text-primary",
  },
  {
    href: "/natulab/tanaman",
    label: "Visualisasi Tanaman",
    desc: "Jelajahi model 3D tanaman obat",
    icon: Leaf,
    tone: "bg-primary/10 text-primary",
  },
  {
    href: "/natulab/alat",
    label: "Visualisasi Alat Lab",
    desc: "Kenali alat laboratorium dalam 3D",
    icon: FlaskConical,
    tone: "bg-accent/15 text-accent",
  },
  {
    href: "/natulab/praktikum",
    label: "Simulasi Praktikum",
    desc: "Latihan praktikum virtual bertahap",
    icon: Microscope,
    tone: "bg-accent/15 text-accent",
  },
];

export default function NatuLab() {
  return (
    <div>
      <PageHeader title="NatuLab" />
      <div className="space-y-3 p-4">
        <p className="text-sm text-muted">
          Eksplorasi visual & praktik: lihat objek dalam 3D/AR, lalu coba
          praktikumnya.
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
                <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
