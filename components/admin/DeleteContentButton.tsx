"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import {
  deletePlant,
  deleteTool,
  deleteLibraryItem,
} from "@/lib/actions/content";

type Kind = "plant" | "tool" | "library";

const actions = {
  plant: deletePlant,
  tool: deleteTool,
  library: deleteLibraryItem,
} as const;

export function DeleteContentButton({
  kind,
  id,
  nama,
}: {
  kind: Kind;
  id: string;
  nama: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Hapus "${nama}"? Tindakan ini permanen.`)) return;
        startTransition(async () => {
          const res = await actions[kind](id);
          if (res.error) alert(res.error);
          router.refresh();
        });
      }}
      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-danger hover:bg-danger/10 disabled:opacity-50"
      aria-label={`Hapus ${nama}`}
    >
      <Trash2 className="h-4 w-4" />
      {pending ? "Menghapus…" : "Hapus"}
    </button>
  );
}
