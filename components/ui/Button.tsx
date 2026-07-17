import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

export function buttonClass(variant: Variant = "primary", size: Size = "md") {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<Variant, string> = {
    primary: "bg-primary text-white shadow-sm hover:bg-primary-dark",
    accent: "bg-accent text-white hover:brightness-95",
    outline: "border border-line bg-surface text-ink hover:bg-black/5",
    ghost: "text-primary hover:bg-primary/10",
  };
  const sizes: Record<Size, string> = {
    sm: "h-9 px-3.5 text-sm",
    md: "h-12 px-5 text-sm",
    lg: "h-[52px] px-6 text-base",
  };
  return cn(base, variants[variant], sizes[size]);
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return <button className={cn(buttonClass(variant, size), className)} {...props} />;
}
