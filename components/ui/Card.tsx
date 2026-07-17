import { cn } from "@/lib/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-line/70 bg-surface p-4 shadow-card",
        className,
      )}
      {...props}
    />
  );
}
