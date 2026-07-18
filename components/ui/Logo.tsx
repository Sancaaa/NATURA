import { cn } from "@/lib/cn";

/**
 * Brandmark NATURA - menggunakan logo dari referensi UI
 */
export function Logo({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="NATURA Logo"
      width={size}
      height={size}
      className={cn("shrink-0 object-contain rounded-xl", className)}
    />
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
