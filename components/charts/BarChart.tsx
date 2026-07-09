export function BarChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      <div className="flex h-40 items-end gap-3">
        {data.map((d, i) => (
          <div key={i} className="flex flex-1 flex-col items-center justify-end">
            <span className="mb-1 text-xs font-semibold text-ink">{d.value}</span>
            <div
              className="w-full rounded-t-md bg-primary"
              style={{ height: `${(d.value / max) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-3">
        {data.map((d, i) => (
          <span key={i} className="flex-1 text-center text-[11px] text-muted">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
