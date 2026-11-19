// src/app/dashboard/instructor/calendar/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
// import { availabilityService } from "@/services/availability/availability.service";
import type { InstructorBooking, DayKey } from "@/types/availability.types";
import { DAYS } from "@/types/availability.types";

import {
  startOfWeek,
  addDays,
  toISODate,
  formatWeekLabel,
  timeToMinutes,
  minutesToTime,
} from "@/lib/week-utils";

const DAY_START = 7 * 60; // 07:00
const DAY_END = 21 * 60; // 21:00
const PX_PER_MIN = 0.9; // row height = 90px per hour

export default function InstructorCalendarPage() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [bookings, setBookings] = useState<InstructorBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const weekStartISO = useMemo(() => toISODate(weekStart), [weekStart]);

  //   const load = async () => {
  //     setIsLoading(true);
  //     setError(null);
  //     try {
  //       const data = await availabilityService.getBookings(weekStartISO);
  //       setBookings(data);
  //     } catch (e) {
  //       setError(e instanceof Error ? e : new Error("Failed to load bookings"));
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 🚧 TEMP: swap in dummy data
      await new Promise((r) => setTimeout(r, 300)); // fake latency
      setBookings(buildDummyBookings(weekStart));

      // 👇 restore when the API is ready:
      // const data = await availabilityService.getBookings(weekStartISO);
      // setBookings(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to load bookings"));
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStartISO]);

  const hours = useMemo(() => {
    const out: number[] = [];
    for (let m = DAY_START; m <= DAY_END; m += 60) out.push(m);
    return out;
  }, []);

  const bookingsByDay = useMemo(() => {
    const map: Record<DayKey, InstructorBooking[]> = {
      mon: [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
      sat: [],
      sun: [],
    };

    // Precompute the ISO date → day key mapping once per week
    const isoToKey = new Map<string, DayKey>();
    DAYS.forEach((d, i) => {
      const iso = toISODate(addDays(weekStart, i));
      isoToKey.set(iso, d.key);
    });

    bookings.forEach((b) => {
      const iso = toISODate(new Date(b.date));
      const key = isoToKey.get(iso);
      if (key) map[key]!.push(b); // 👈 `!` — map is fully initialized, key is DayKey
    });

    return map;
  }, [bookings, weekStart]);

  const todayISO = toISODate(new Date());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Calendar</h1>
          <p className="text-sm text-muted-foreground">
            Your lessons for the week — click a lesson for details.
          </p>
        </div>
        <Link href="/dashboard/instructor/calendar/availability">
          <Button className="gap-2">
            <Settings className="h-4 w-4" />
            Manage Availability
          </Button>
        </Link>
      </div>

      {/* Week navigation */}
      <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setWeekStart((w) => addDays(w, -7))}
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setWeekStart(startOfWeek(new Date()))}>
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setWeekStart((w) => addDays(w, 7))}
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="ml-2 text-sm font-medium">{formatWeekLabel(weekStart)}</div>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <LegendDot className="bg-blue-500" label="Confirmed" />
          <LegendDot className="bg-amber-500" label="Pending" />
          <LegendDot className="bg-emerald-500" label="Completed" />
        </div>
      </Card>

      {/* Body */}
      {isLoading ? (
        <LoadingSpinner size="lg" text="Loading your week..." />
      ) : error ? (
        <ErrorState error={error} onRetry={load} title="Failed to load calendar" />
      ) : (
        <Card className="overflow-hidden p-0">
          {/* Sticky day header */}
          <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b bg-muted/40">
            <div className="p-2 text-xs font-medium text-muted-foreground" />
            {DAYS.map((d, i) => {
              const date = addDays(weekStart, i);
              const iso = toISODate(date);
              const isToday = iso === todayISO;
              return (
                <div
                  key={d.key}
                  className={`border-l p-2 text-center ${isToday ? "bg-primary/10" : ""}`}
                >
                  <div className="text-xs font-medium uppercase text-muted-foreground">
                    {d.short}
                  </div>
                  <div className={`text-lg font-semibold ${isToday ? "text-primary" : ""}`}>
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time grid */}
          <div className="relative max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))]">
              {/* Hour labels */}
              <div>
                {hours.map((m) => (
                  <div
                    key={m}
                    className="border-b border-transparent pr-2 pt-1 text-right text-[10px] text-muted-foreground"
                    style={{ height: 60 * PX_PER_MIN }}
                  >
                    {minutesToTime(m)}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {DAYS.map((d, i) => {
                const dayBookings = bookingsByDay[d.key] ?? [];
                const date = addDays(weekStart, i);
                const isToday = toISODate(date) === todayISO;
                const totalHeight = ((DAY_END - DAY_START) / 60) * 60 * PX_PER_MIN;

                return (
                  <div
                    key={d.key}
                    className={`relative border-l ${isToday ? "bg-primary/[0.03]" : ""}`}
                    style={{ height: totalHeight }}
                  >
                    {/* Hour grid lines */}
                    {hours.map((m, idx) => (
                      <div
                        key={m}
                        className={`absolute inset-x-0 ${
                          idx === 0 ? "" : "border-t border-dashed border-border/50"
                        }`}
                        style={{ top: idx * 60 * PX_PER_MIN }}
                      />
                    ))}

                    {/* Bookings */}
                    {dayBookings.map((b) => {
                      const top = (timeToMinutes(b.start) - DAY_START) * PX_PER_MIN;
                      const height = (timeToMinutes(b.end) - timeToMinutes(b.start)) * PX_PER_MIN;
                      return (
                        <BookingBlock
                          key={b.id}
                          booking={b}
                          style={{ top, height: Math.max(height, 32) }}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${className}`} />
      {label}
    </span>
  );
}

function BookingBlock({
  booking,
  style,
}: {
  booking: InstructorBooking;
  style: React.CSSProperties;
}) {
  const colorByStatus = {
    confirmed: "border-l-blue-500 bg-blue-50 dark:bg-blue-950/40",
    pending: "border-l-amber-500 bg-amber-50 dark:bg-amber-950/40",
    completed: "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
    cancelled: "border-l-muted bg-muted/50 opacity-60",
  }[booking.status];

  return (
    <div
      className={`absolute left-1 right-1 overflow-hidden rounded-md border-l-4 p-1.5 text-left shadow-sm transition hover:shadow-md ${colorByStatus}`}
      style={style}
      title={`${booking.studentName} · ${booking.start}–${booking.end}`}
    >
      <div className="truncate text-[11px] font-semibold">
        {booking.start}–{booking.end}
      </div>
      <div className="truncate text-[11px]">{booking.studentName}</div>
      {booking.lessonType && (
        <div className="mt-0.5 hidden text-[10px] text-muted-foreground sm:block">
          {booking.lessonType}
        </div>
      )}
    </div>
  );
}

// 🚧 TEMP: hardcoded dummy bookings. Remove when the real API is live.

function buildDummyBookings(weekStart: Date): InstructorBooking[] {
  const dayISO = (offset: number) => toISODate(addDays(weekStart, offset));

  return [
    // Monday
    {
      id: "b1",
      studentName: "Aoife Murphy",
      studentPhone: "087 123 4567",
      date: dayISO(0),
      start: "09:00",
      end: "10:00",
      status: "confirmed",
      lessonType: "Manual",
      pickupLocation: "Sycamore St, Dublin 1",
    },
    {
      id: "b2",
      studentName: "Cian O'Brien",
      studentPhone: "086 234 5678",
      date: dayISO(0),
      start: "11:00",
      end: "12:00",
      status: "confirmed",
      lessonType: "Automatic",
      pickupLocation: "Rathmines, Dublin 6",
    },
    {
      id: "b3",
      studentName: "Saoirse Kelly",
      studentPhone: "085 345 6789",
      date: dayISO(0),
      start: "14:00",
      end: "15:00",
      status: "pending",
      lessonType: "Manual",
      pickupLocation: "Swords, Co. Dublin",
    },

    // Tuesday
    {
      id: "b4",
      studentName: "Darragh Walsh",
      studentPhone: "083 456 7890",
      date: dayISO(1),
      start: "10:00",
      end: "11:00",
      status: "confirmed",
      lessonType: "Manual",
      pickupLocation: "Tallaght, Dublin 24",
    },
    {
      id: "b5",
      studentName: "Niamh Byrne",
      studentPhone: "089 567 8901",
      date: dayISO(1),
      start: "13:00",
      end: "14:00",
      status: "confirmed",
      lessonType: "Automatic",
      pickupLocation: "Blackrock, Co. Dublin",
    },
    {
      id: "b6",
      studentName: "Liam Doyle",
      studentPhone: "087 678 9012",
      date: dayISO(1),
      start: "15:00",
      end: "16:00",
      status: "pending",
      lessonType: "Manual",
      pickupLocation: "Blanchardstown, Dublin 15",
    },
    {
      id: "b7",
      studentName: "Róisín Kennedy",
      studentPhone: "086 789 0123",
      date: dayISO(1),
      start: "18:00",
      end: "19:00",
      status: "confirmed",
      lessonType: "Manual",
      pickupLocation: "Sycamore St, Dublin 1",
    },

    // Wednesday
    {
      id: "b8",
      studentName: "Oisín Ryan",
      studentPhone: "085 890 1234",
      date: dayISO(2),
      start: "09:00",
      end: "10:00",
      status: "confirmed",
      lessonType: "Automatic",
      pickupLocation: "Rathmines, Dublin 6",
    },
    {
      id: "b9",
      studentName: "Ciara Lynch",
      studentPhone: "083 901 2345",
      date: dayISO(2),
      start: "11:00",
      end: "12:00",
      status: "completed",
      lessonType: "Manual",
      pickupLocation: "Swords, Co. Dublin",
    },
    {
      id: "b10",
      studentName: "Fionn Gallagher",
      studentPhone: "089 012 3456",
      date: dayISO(2),
      start: "16:00",
      end: "17:00",
      status: "confirmed",
      lessonType: "Manual",
      pickupLocation: "Tallaght, Dublin 24",
    },

    // Thursday
    {
      id: "b11",
      studentName: "Aoife Murphy",
      studentPhone: "087 123 4567",
      date: dayISO(3),
      start: "10:00",
      end: "11:00",
      status: "confirmed",
      lessonType: "Manual",
      pickupLocation: "Sycamore St, Dublin 1",
    },
    {
      id: "b12",
      studentName: "Cian O'Brien",
      studentPhone: "086 234 5678",
      date: dayISO(3),
      start: "14:00",
      end: "15:00",
      status: "confirmed",
      lessonType: "Automatic",
      pickupLocation: "Rathmines, Dublin 6",
    },
    {
      id: "b13",
      studentName: "Saoirse Kelly",
      studentPhone: "085 345 6789",
      date: dayISO(3),
      start: "17:00",
      end: "18:00",
      status: "pending",
      lessonType: "Manual",
      pickupLocation: "Blanchardstown, Dublin 15",
    },

    // Friday
    {
      id: "b14",
      studentName: "Darragh Walsh",
      studentPhone: "083 456 7890",
      date: dayISO(4),
      start: "09:00",
      end: "10:00",
      status: "confirmed",
      lessonType: "Manual",
      pickupLocation: "Tallaght, Dublin 24",
    },
    {
      id: "b15",
      studentName: "Niamh Byrne",
      studentPhone: "089 567 8901",
      date: dayISO(4),
      start: "11:00",
      end: "12:00",
      status: "confirmed",
      lessonType: "Automatic",
      pickupLocation: "Blackrock, Co. Dublin",
    },
    {
      id: "b16",
      studentName: "Liam Doyle",
      studentPhone: "087 678 9012",
      date: dayISO(4),
      start: "13:00",
      end: "14:00",
      status: "completed",
      lessonType: "Manual",
      pickupLocation: "Swords, Co. Dublin",
    },
    {
      id: "b17",
      studentName: "Róisín Kennedy",
      studentPhone: "086 789 0123",
      date: dayISO(4),
      start: "15:00",
      end: "16:00",
      status: "confirmed",
      lessonType: "Manual",
      pickupLocation: "Sycamore St, Dublin 1",
    },
    {
      id: "b18",
      studentName: "Oisín Ryan",
      studentPhone: "085 890 1234",
      date: dayISO(4),
      start: "18:00",
      end: "19:00",
      status: "pending",
      lessonType: "Automatic",
      pickupLocation: "Rathmines, Dublin 6",
    },

    // Saturday (short day)
    {
      id: "b19",
      studentName: "Ciara Lynch",
      studentPhone: "083 901 2345",
      date: dayISO(5),
      start: "09:00",
      end: "10:00",
      status: "confirmed",
      lessonType: "Manual",
      pickupLocation: "Tallaght, Dublin 24",
    },
    {
      id: "b20",
      studentName: "Fionn Gallagher",
      studentPhone: "089 012 3456",
      date: dayISO(5),
      start: "10:00",
      end: "11:00",
      status: "confirmed",
      lessonType: "Manual",
      pickupLocation: "Swords, Co. Dublin",
    },
    {
      id: "b21",
      studentName: "Aoife Murphy",
      studentPhone: "087 123 4567",
      date: dayISO(5),
      start: "11:00",
      end: "12:00",
      status: "pending",
      lessonType: "Manual",
      pickupLocation: "Sycamore St, Dublin 1",
    },
  ];
}
