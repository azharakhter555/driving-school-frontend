"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateStripProps {
  /** Number of quick-pick days to show (default: 14) */
  daysCount?: number;
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
}

export function DateStrip({ daysCount = 14, selectedDate, onSelectDate }: DateStripProps) {
  const [showCustom, setShowCustom] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const days = Array.from({ length: daysCount }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // ISO yyyy-mm-dd for the native input
  const toInputValue = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(
      2,
      "0"
    )}`;

  const today = toInputValue(new Date());
  const maxDate = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6); // 6 months ahead
    return toInputValue(d);
  })();

  // Focus the input when the custom row appears
  useEffect(() => {
    if (showCustom) inputRef.current?.focus();
  }, [showCustom]);

  const isSelectedCustom =
    showCustom || !days.some((d) => d.toDateString() === selectedDate.toDateString());

  return (
    <div className="space-y-3">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
        {days.map((d, i) => {
          const active = d.toDateString() === selectedDate.toDateString();
          const isToday = i === 0;
          return (
            <button
              key={d.toISOString()}
              onClick={() => {
                setShowCustom(false);
                onSelectDate(d);
              }}
              className={cn(
                "group relative flex min-w-[76px] flex-col items-center rounded-2xl border px-3 py-3 transition-all",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                  : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-sm"
              )}
            >
              {isToday && !active && (
                <span className="absolute -top-2 right-2 rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-semibold uppercase text-secondary-foreground">
                  Today
                </span>
              )}
              <span
                className={cn(
                  "text-[10px] font-medium uppercase tracking-wider",
                  active ? "opacity-90" : "text-muted-foreground"
                )}
              >
                {d.toLocaleDateString("en-IE", { weekday: "short" })}
              </span>
              <span className="mt-0.5 text-xl font-bold leading-none">{d.getDate()}</span>
              <span
                className={cn("mt-1 text-[10px]", active ? "opacity-90" : "text-muted-foreground")}
              >
                {d.toLocaleDateString("en-IE", { month: "short" })}
              </span>
            </button>
          );
        })}

        {/* Custom date trigger */}
        <button
          onClick={() => setShowCustom((v) => !v)}
          className={cn(
            "flex min-w-[76px] flex-col items-center justify-center rounded-2xl border border-dashed px-3 py-3 transition-all",
            isSelectedCustom
              ? "border-primary bg-primary/5 text-primary"
              : "border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary"
          )}
          aria-label="Pick a custom date"
        >
          <CalendarPlus className="h-5 w-5" />
          <span className="mt-1 text-[10px] font-medium uppercase tracking-wider">More</span>
        </button>
      </div>

      {/* Custom date input row */}
      {showCustom && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3">
          <label htmlFor="custom-date" className="text-xs font-medium text-foreground">
            Pick any date:
          </label>
          <input
            ref={inputRef}
            id="custom-date"
            type="date"
            min={today}
            max={maxDate}
            value={toInputValue(selectedDate)}
            onChange={(e) => {
              const [y, m, d] = e.target.value.split("-").map(Number);
              if (!y || !m || !d) return;
              const picked = new Date(y, m - 1, d);
              picked.setHours(0, 0, 0, 0);
              onSelectDate(picked);
            }}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={() => setShowCustom(false)}
            className="ml-auto rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close custom date picker"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
