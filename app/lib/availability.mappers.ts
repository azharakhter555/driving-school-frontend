import type { DayAvailability } from "@/types/availability.types";
import { DEFAULT_WEEK } from "@/types/availability.types";
import { timeToMinutes } from "@/lib/week-utils";
import { minutesToTime, normalizeTime } from "@/lib/time";
import type { Break, DayState } from "../types/availability.types";
import { WORKDAY_END, WORKDAY_START } from "@/lib/constants";

/**
 * API → UI.
 * Folds a list of available ranges back into "one working window + gaps-as-breaks".
 *   [{09:00–12:00}, {13:00–17:00}] → { start: "09:00", end: "17:00", breaks: [{12–13}] }
 */
export function toDayState(day: DayAvailability): DayState {
  const empty: DayState = {
    day: day.day,
    enabled: day.enabled,
    start: WORKDAY_START,
    end: WORKDAY_END,
    breaks: [],
  };
  if (!day.enabled || day.ranges.length === 0) return empty;

  const sorted = [...day.ranges].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  if (!first || !last) return empty;

  const start = normalizeTime(first.start);
  const end = normalizeTime(last.end);

  const breaks: Break[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];
    if (!current || !next) continue;
    const gapStart = normalizeTime(current.end);
    const gapEnd = normalizeTime(next.start);
    if (timeToMinutes(gapEnd) > timeToMinutes(gapStart)) {
      breaks.push({ start: gapStart, end: gapEnd });
    }
  }
  return { day: day.day, enabled: true, start, end, breaks };
}

/**
 * UI → API.
 * Subtracts merged breaks from the working window.
 *   { start: "09:00", end: "17:00", breaks: [{12–13}] } → [{09:00–12:00}, {13:00–17:00}]
 */
export function toDayAvailability(day: DayState): DayAvailability {
  if (!day.enabled) return { day: day.day, enabled: false, ranges: [] };

  const startMin = timeToMinutes(day.start);
  const endMin = timeToMinutes(day.end);
  if (endMin <= startMin) return { day: day.day, enabled: false, ranges: [] };

  const validBreaks = day.breaks
    .map((b) => ({ start: timeToMinutes(b.start), end: timeToMinutes(b.end) }))
    .filter((b) => b.end > b.start && b.start >= startMin && b.end <= endMin)
    .sort((a, b) => a.start - b.start);

  const mergedBreaks: Array<{ start: number; end: number }> = [];
  for (const b of validBreaks) {
    const last = mergedBreaks[mergedBreaks.length - 1];
    if (last && b.start <= last.end) {
      last.end = Math.max(last.end, b.end);
    } else {
      mergedBreaks.push({ ...b });
    }
  }

  const ranges: Array<{ start: string; end: string }> = [];
  let cursor = startMin;
  for (const b of mergedBreaks) {
    if (b.start > cursor) {
      ranges.push({ start: minutesToTime(cursor), end: minutesToTime(b.start) });
    }
    cursor = Math.max(cursor, b.end);
  }
  if (cursor < endMin) {
    ranges.push({ start: minutesToTime(cursor), end: minutesToTime(endMin) });
  }

  if (ranges.length === 0) return { day: day.day, enabled: false, ranges: [] };
  return { day: day.day, enabled: true, ranges };
}

export function getDefaultUiDays(): DayState[] {
  return DEFAULT_WEEK.days.map(toDayState);
}
