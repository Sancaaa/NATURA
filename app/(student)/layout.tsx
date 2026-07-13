import BottomNav from "@/components/student/BottomNav";
import { requireRole } from "@/lib/auth";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["student", "admin"]);
  return (
    <div className="relative mx-auto min-h-dvh max-w-md pb-20">
      {children}
      <BottomNav />
    </div>
  );
}
