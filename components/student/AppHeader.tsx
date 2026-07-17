import { Logo } from "@/components/ui/Logo";

/** Header halaman siswa: brandmark + nama modul (NatuLab/NatuLearn/…). */
export function AppHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-40 flex items-center gap-2.5 bg-bg/80 px-4 py-3.5 backdrop-blur">
      <Logo size={32} />
      <span className="text-xl font-extrabold tracking-tight">{title}</span>
    </header>
  );
}
