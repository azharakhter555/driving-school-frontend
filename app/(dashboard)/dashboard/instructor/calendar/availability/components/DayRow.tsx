"use client";

import { memo, useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TimeRangeInput } from "@/components/shared/inputs/TimeRangeInput";
import { addDays, timeToMinutes, toISODate } from "@/lib/week-utils";
import { DAYS } from "@/types/availability.types";
import type { DayKey } from "@/types/availability.types";
import { DEFAULT_BREAK_END, DEFAULT_BREAK_START } from "@/lib/constants";
import type { Break, DayState } from "@/types/availability.types";
import { BreakRow } from "./BreakRow";

type Props = {
  day: DayState;
  weekStart: Date;
  dayIndex: number;
  readOnly: boolean;
  updateDay: (dayKey: DayKey, updater: (d: DayState) => DayState) => void;
};

export const DayRow = memo(function DayRow({
  day,
  weekStart,
  dayIndex,
  readOnly,
  updateDay,
}: Props) {
  const label = DAYS.find((d) => d.key === day.day);

  // weekStart + dayIndex are stable across edits → this memo never recomputes
  // until the week itself changes.
  const date = useMemo(() => addDays(weekStart, dayIndex), [weekStart, dayIndex]);

  // Today check — cheap string compare, recomputed per render.
  // Only fires on the row that matches today's ISO date (in the current week).
  const isToday = toISODate(date) === toISODate(new Date());

  const workingInvalid = timeToMinutes(day.end) <= timeToMinutes(day.start);

  const netHours = useMemo(() => {
    if (!day.enabled || workingInvalid) return 0;
    const startMin = timeToMinutes(day.start);
    const endMin = timeToMinutes(day.end);
    let total = endMin - startMin;
    for (const b of day.breaks) {
      const bs = timeToMinutes(b.start);
      const be = timeToMinutes(b.end);
      const overlap = Math.min(endMin, be) - Math.max(startMin, bs);
      if (overlap > 0) total -= overlap;
    }
    return Math.max(0, total / 60);
  }, [day, workingInvalid]);

  // Every handler uses `day.day` (a string — stable) rather than closing over `day`.
  // That keeps these callbacks referentially stable, which is what lets `memo` work.
  const handleToggle = useCallback(
    (v: boolean) => updateDay(day.day, (d) => ({ ...d, enabled: v })),
    [updateDay, day.day]
  );
  const handleWorkingHours = useCallback(
    (patch: Partial<Pick<DayState, "start" | "end">>) =>
      updateDay(day.day, (d) => ({ ...d, ...patch })),
    [updateDay, day.day]
  );
  const handleAddBreak = useCallback(
    () =>
      updateDay(day.day, (d) => ({
        ...d,
        breaks: [...d.breaks, { start: DEFAULT_BREAK_START, end: DEFAULT_BREAK_END }],
      })),
    [updateDay, day.day]
  );
  const handleRemoveBreak = useCallback(
    (index: number) =>
      updateDay(day.day, (d) => ({
        ...d,
        breaks: d.breaks.filter((_, i) => i !== index),
      })),
    [updateDay, day.day]
  );
  const handleUpdateBreak = useCallback(
    (index: number, patch: Partial<Break>) =>
      updateDay(day.day, (d) => ({
        ...d,
        breaks: d.breaks.map((b, i) => (i === index ? { ...b, ...patch } : b)),
      })),
    [updateDay, day.day]
  );

  return (
    <Card
      className={`p-4 transition ${day.enabled ? "" : "opacity-60"} ${
        isToday ? "ring-1 ring-primary/40" : ""
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex w-full items-center justify-between sm:w-48 sm:justify-start sm:gap-4">
          <div className="flex items-center gap-3">
            <Switch
              checked={day.enabled}
              onCheckedChange={handleToggle}
              disabled={readOnly}
              aria-label={`Toggle ${label?.label ?? ""} availability`}
            />
            <div>
              <div className="flex items-center font-medium">
                {label?.label}
                {isToday && (
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    Today
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {date.toLocaleDateString("en-IE", { day: "numeric", month: "short" })}
                {day.enabled && netHours > 0 && (
                  <span className="ml-2">
                    · {netHours % 1 === 0 ? netHours : netHours.toFixed(1)}h
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {!day.enabled ? (
            <p className="py-2 text-sm text-muted-foreground">Unavailable on {label?.label}s.</p>
          ) : (
            <>
              <div>
                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Working hours
                </div>
                <TimeRangeInput
                  start={day.start}
                  end={day.end}
                  onChange={handleWorkingHours}
                  disabled={readOnly}
                  invalid={workingInvalid}
                  errorText={workingInvalid ? "End must be after start" : undefined}
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Breaks {day.breaks.length > 0 && `(${day.breaks.length})`}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddBreak}
                    disabled={readOnly}
                    title={readOnly ? "Past weeks are read-only" : undefined}
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Add break
                  </Button>
                </div>

                {day.breaks.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No breaks — available the full working hours.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {day.breaks.map((b, i) => (
                      <BreakRow
                        key={i}
                        breakStart={b.start}
                        breakEnd={b.end}
                        workingStart={day.start}
                        workingEnd={day.end}
                        readOnly={readOnly}
                        onChange={(patch) => handleUpdateBreak(i, patch)}
                        onRemove={() => handleRemoveBreak(i)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
});
