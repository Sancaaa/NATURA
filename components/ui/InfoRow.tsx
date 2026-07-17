/** Baris info berlabel; menyembunyikan diri bila nilainya kosong. */
export function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </div>
      <div className="text-sm">{value}</div>
    </div>
  );
}
