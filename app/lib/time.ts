/** 555 → "09:15" */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** "17:00:00" → "17:00" (Postgres time → HTML input time) */
export function normalizeTime(t: string): string {
  return t.slice(0, 5);
}
