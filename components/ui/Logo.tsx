import { cn } from "@/lib/cn";

/**
 * Brandmark NATURA — daun putih dengan huruf "N" di atas kotak biru
 * membulat. Menggantikan ikon Leaf generik agar sesuai referensi UI.
 */
export function Logo({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="natura-logo-g" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0" stopColor="#3550ff" />
          <stop offset="1" stopColor="#1029bb" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#natura-logo-g)" />
      {/* Daun */}
      <path
        d="M13 35C13 21 21 13 35 13C35 27 27 35 13 35Z"
        fill="#ffffff"
      />
      {/* Huruf N mengikuti tulang daun */}
      <path
        d="M18.5 31V19L29.5 29V17"
        stroke="#1537f9"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/** Logo + nama produk, dipakai di header halaman & sidebar. */
export function Wordmark({
  label = "NATURA",
  size = 32,
  className,
  labelClassName,
}: {
  label?: string;
  size?: number;
  className?: string;
  labelClassName?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Logo size={size} />
      <span className={cn("text-lg font-extrabold tracking-tight", labelClassName)}>
        {label}
      </span>
    </div>
  );
}
