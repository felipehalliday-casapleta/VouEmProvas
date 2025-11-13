// client/src/lib/date-tz.ts
const TZ = "America/Sao_Paulo";

export function todayISOInTZ(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const y = parts.find(p => p.type === "year")?.value ?? "0000";
  const m = parts.find(p => p.type === "month")?.value ?? "01";
  const d = parts.find(p => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${d}`; // YYYY-MM-DD
}

export type Bucket = "hoje" | "antes" | "depois";

export function bucketByDateISO(dateISO?: string | null): Bucket | null {
  if (!dateISO) return null;
  const today = todayISOInTZ();
  if (dateISO === today) return "hoje";
  return dateISO < today ? "antes" : "depois";
}
