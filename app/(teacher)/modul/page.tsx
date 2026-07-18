import Link from "next/link";
import { getLibrary } from "@/lib/db/library";
import { getCurrentProfile } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { DeleteContentButton } from "@/components/admin/DeleteContentButton";
import { Plus, Paperclip, Pencil } from "lucide-react";

/**
 * Manajemen modul materi (guru). Guru melihat seluruh katalog yang juga
 * dilihat siswa, tapi hanya bisa menyunting/menghapus modul buatannya
 * sendiri - batas ini ditegakkan RLS `library_write`.
 */
export default async function ManajemenModul() {
  const [library, me] = await Promise.all([getLibrary(), getCurrentProfile()]);
  const isAdmin = me?.role === "admin";
  const bisaUbah = (createdBy: string | null) =>
    isAdmin || (!!me && createdBy === me.id);

  const milikSaya = library.filter((i) => bisaUbah(i.createdBy));
  const lainnya = library.filter((i) => !bisaUbah(i.createdBy));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Modul Materi</h1>
          <p className="text-sm text-muted">
            Materi yang tampil di NatuLearn siswa. Kamu bisa menyunting modul
            yang kamu buat sendiri.
          </p>
        </div>
        <Link href="/modul/baru" className={buttonClass("primary", "md")}>
          <Plus className="h-4 w-4" /> Modul baru
        </Link>
      </div>

      <section>
        <h2 className="mb-2 font-bold">Modul saya ({milikSaya.length})</h2>
        {milikSaya.length === 0 ? (
          <Card className="border-dashed text-sm text-muted">
            Belum ada modul buatanmu. Klik <b>Modul baru</b> untuk membuat yang
            pertama.
          </Card>
        ) : (
          <div className="space-y-2">
            {milikSaya.map((i) => (
              <Card key={i.id} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{i.judul}</div>
                  <div className="truncate text-xs text-muted">
                    {i.ringkasan || "-"}
                  </div>
                </div>
                <Badge tone="primary">{i.tipe}</Badge>
                {i.lampiran.length > 0 && (
                  <Badge tone="muted">
                    <Paperclip className="mr-1 h-3 w-3" />
                    {i.lampiran.length}
                  </Badge>
                )}
                <Link
                  href={`/modul/${i.id}`}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
                >
                  <Pencil className="h-4 w-4" /> Sunting
                </Link>
                <DeleteContentButton kind="library" id={i.id} nama={i.judul} />
              </Card>
            ))}
          </div>
        )}
      </section>

      {lainnya.length > 0 && (
        <section>
          <h2 className="mb-2 font-bold">Modul lain ({lainnya.length})</h2>
          <p className="mb-2 text-xs text-muted">
            Dibuat guru lain atau admin - hanya bisa dilihat.
          </p>
          <div className="space-y-2">
            {lainnya.map((i) => (
              <Card key={i.id} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{i.judul}</div>
                  <div className="truncate text-xs text-muted">
                    {i.ringkasan || "-"}
                  </div>
                </div>
                <Badge tone="muted">{i.tipe}</Badge>
                {/* Rute /natulearn/* digerbang untuk siswa - guru harus tetap
                    di area guru, jadi pratinjau dibuka di /modul/[id]. */}
                <Link
                  href={`/modul/${i.id}`}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Lihat
                </Link>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
