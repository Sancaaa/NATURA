"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteAssignment } from "@/lib/actions/classroom";

export function DeleteAssignmentButton({
  assignmentId,
  classId,
  judul,
}: {
  assignmentId: string;
  classId: string;
  judul: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (
          !confirm(
            `Hapus tugas "${judul}"? Jawaban siswa untuk tugas ini ikut terhapus.`,
          )
        )
          return;
        startTransition(async () => {
          const res = await deleteAssignment(assignmentId, classId);
          if (res.error) alert(res.error);
          router.refresh();
        });
      }}
      className="rounded-lg p-1.5 text-danger hover:bg-danger/10 disabled:opacity-50"
      aria-label={`Hapus tugas ${judul}`}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
