import { FileText, LinkIcon } from "lucide-react";
import type { Attachment } from "@/lib/attachments";

/** Daftar lampiran (file/link pendukung) — tampilan siswa. */
export function AttachmentList({
  items,
  title = "Lampiran",
}: {
  items: Attachment[];
  title?: string;
}) {
  if (!items.length) return null;
  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        {title}
      </h2>
      <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {items.map((a, i) => (
          <a
            key={`${a.url}-${i}`}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 hover:bg-black/5"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              {a.tipe === "file" ? (
                <FileText className="h-4 w-4" />
              ) : (
                <LinkIcon className="h-4 w-4" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{a.nama}</span>
              <span className="block text-xs text-muted">
                {a.tipe === "file" ? "Berkas" : "Tautan"}
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
