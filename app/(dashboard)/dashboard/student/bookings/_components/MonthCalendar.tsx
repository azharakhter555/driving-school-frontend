"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
}

export function MonthCalendar({ selectedDate, onSelectDate }: Props) {
  const [month, setMonth] = useState(() => startOfMonth(selectedDate));

  const days = useMemo(() => buildMonthGrid(month), [month]);
  const today = startOfDay(new Date());

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => setMonth(addMonths(month, -1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="text-sm font-medium">
          {month.toLocaleDateString("en-IE", { month: "long", year: "numeric" })}
        </div>

        <Button variant="ghost" size="icon" onClick={() => setMonth(addMonths(month, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekday labels */}
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Month grid — 6 rows × 7 cols */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isPast = day < today;
          const isToday = isSameDay(day, today);
          const isOtherMonth = day.getMonth() !== month.getMonth();

          return (
            <button
              key={day.toISOString()}
              disabled={isPast}
              onClick={() => onSelectDate(day)}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-sm transition ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : isPast
                    ? "cursor-not-allowed border-transparent opacity-40"
                    : isOtherMonth
                      ? "border-transparent text-muted-foreground hover:border-primary hover:bg-accent"
                      : "border-transparent hover:border-primary hover:bg-accent"
              }`}
            >
              <span className="font-medium">{day.getDate()}</span>
              {isToday && !isSelected && (
                <span className="mt-0.5 h-1 w-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── helpers ───

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfMonth(d: Date) {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addMonths(d: Date, n: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return startOfMonth(x);
}

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

/**
 * Builds a 6×7 grid starting from the Sunday before the 1st of the month.
 * Always 42 cells, so the layout never jumps between months.
 */
function buildMonthGrid(monthStart: Date): Date[] {
  const first = startOfMonth(monthStart);
  const startOffset = first.getDay(); // 0 = Sunday
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}
