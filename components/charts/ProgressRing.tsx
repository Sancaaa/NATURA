export function ProgressRing({
  value,
  label,
  size = 96,
}: {
  value: number;
  label?: string;
  size?: number;
}) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const off = c - (Math.max(0, Math.min(100, value)) / 100) * c;
  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={r}
          className="fill-none stroke-black/10"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          className="fill-none stroke-primary"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-lg font-bold">{value}%</div>
        {label && <div className="text-[10px] text-muted">{label}</div>}
      </div>
    </div>
  );
}
