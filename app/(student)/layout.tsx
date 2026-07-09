import BottomNav from "@/components/student/BottomNav";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto min-h-dvh max-w-md pb-20">
      {children}
      <BottomNav />
    </div>
  );
}
