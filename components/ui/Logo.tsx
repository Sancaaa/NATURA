import { cn } from "@/lib/cn";

/**
 * Brandmark NATURA - daun putih dengan huruf "N" di atas kotak biru
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
      <rect width="48" height="48" rx="13" fill="url(#natura-logo-g)" />
      {/* Daun putih mengisi sebagian besar kotak */}
      <path
        d="M11 37C11 20.5 20.5 11 37 11C37 27.5 27.5 37 11 37Z"
        fill="#ffffff"
      />
      {/* Huruf N tebal, seolah dicetak pada daun */}
      <path
        d="M17 32V17L31 31V16"
        stroke="url(#natura-logo-g)"
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Tulang daun tipis sebagai aksen */}
      <path
        d="M15 35C22 30 30 22 35 15"
        stroke="#1537f9"
        strokeOpacity="0.18"
        strokeWidth="1.4"
        strokeLinecap="round"
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
