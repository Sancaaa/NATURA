export function BarChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex h-44 items-end gap-3">
      {data.map((d, i) => (
        <div key={i} className="flex h-full flex-1 flex-col items-center gap-1.5">
          <span className="text-xs font-bold text-ink">{d.value}</span>
          {/* Track mengisi sisa ruang vertikal; bar tumbuh dari bawah.
              Tinggi persen bar kini dihitung terhadap tinggi track yang pasti. */}
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-primary to-[#3550ff] transition-[height]"
              style={{ height: `${(d.value / max) * 100}%`, minHeight: "4px" }}
            />
          </div>
          <span className="w-full truncate text-center text-[11px] text-muted">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}
