/**
 * Format tanggal deadline dengan aman. Bila `d` bukan tanggal valid
 * (mis. string demo "3 hari lagi"), kembalikan apa adanya.
 */
export function formatDeadline(d: string | null): string | null {
  if (!d) return null;
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}
