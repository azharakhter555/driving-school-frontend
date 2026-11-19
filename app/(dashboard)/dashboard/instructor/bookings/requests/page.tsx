// src/app/dashboard/instructor/bookings/requests/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Inbox, Calendar as CalendarIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { bookingsService } from "@/services/bookings/booking.instructor.service";
import type { BookingRequest, RequestFilter } from "@/types/booking.types";
import { DAYS } from "@/types/availability.types";
import type { DayKey } from "@/types/availability.types";
import {
  addDays,
  formatWeekLabel,
  minutesToTime,
  startOfWeek,
  timeToMinutes,
  toISODate,
} from "@/lib/week-utils";
import { RequestDrawer } from "./_components/RequestDrawer";

const DAY_START = 7 * 60;
const DAY_END = 21 * 60;
const PX_PER_MIN = 0.9;

export default function BookingRequestsPage() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<RequestFilter>("pending");
  const [selected, setSelected] = useState<BookingRequest | null>(null);

  const weekStartISO = useMemo(() => toISODate(weekStart), [weekStart]);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingsService.getRequests(weekStartISO);
      setRequests(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to load requests"));
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

  const filteredRequests = useMemo(() => {
    if (filter === "all") return requests;
    return requests.filter((r) => r.status === filter);
  }, [requests, filter]);

  const requestsByDay = useMemo(() => {
    const map: Record<DayKey, BookingRequest[]> = {
      mon: [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
      sat: [],
      sun: [],
    };
    const isoToKey = new Map<string, DayKey>();
    DAYS.forEach((d, i) => {
      isoToKey.set(toISODate(addDays(weekStart, i)), d.key);
    });
    filteredRequests.forEach((r) => {
      const key = isoToKey.get(r.date);
      if (key) map[key]!.push(r);
    });
    return map;
  }, [filteredRequests, weekStart]);

  const todayISO = toISODate(new Date());

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  // Called by drawer after a mutation
  const handleMutated = () => {
    setSelected(null);
    load();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Booking Requests</h1>
          <p className="text-sm text-muted-foreground">
            Review and manage incoming lesson requests.
            {pendingCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingCount} pending
              </Badge>
            )}
          </p>
        </div>
        <Link href="/dashboard/instructor/calendar">
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            My Calendar
          </Button>
        </Link>
      </div>

      {/* Toolbar */}
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
            This week
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

        {/* Filter pills */}
        <div className="flex items-center gap-1 rounded-lg border p-1">
          {(["pending", "confirmed", "all"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(f)}
              className="h-7 capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </Card>

      {/* Body */}
      {isLoading ? (
        <LoadingSpinner size="lg" text="Loading requests..." />
      ) : error ? (
        <ErrorState error={error} onRetry={load} title="Failed to load requests" />
      ) : filteredRequests.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 p-12 text-center">
          <div className="rounded-full bg-muted p-4">
            <Inbox className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">
              No {filter !== "all" ? filter : ""} requests this week
            </h3>
            <p className="text-sm text-muted-foreground">
              {filter === "pending"
                ? "You're all caught up. Check back later."
                : "Try a different filter or week."}
            </p>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          {/* Day header */}
          <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b bg-muted/40">
            <div className="p-2" />
            {DAYS.map((d, i) => {
              const date = addDays(weekStart, i);
              const isToday = toISODate(date) === todayISO;
              const count = requestsByDay[d.key]?.length ?? 0;
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
                  {count > 0 && (
                    <div className="mt-0.5 text-[10px] text-muted-foreground">
                      {count} request{count !== 1 && "s"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div className="relative max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))]">
              {/* Hour labels */}
              <div>
                {hours.map((m) => (
                  <div
                    key={m}
                    className="pr-2 pt-1 text-right text-[10px] text-muted-foreground"
                    style={{ height: 60 * PX_PER_MIN }}
                  >
                    {minutesToTime(m)}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {DAYS.map((d, i) => {
                const dayRequests = requestsByDay[d.key] ?? [];
                const date = addDays(weekStart, i);
                const isToday = toISODate(date) === todayISO;
                const totalHeight = ((DAY_END - DAY_START) / 60) * 60 * PX_PER_MIN;

                return (
                  <div
                    key={d.key}
                    className={`relative border-l ${isToday ? "bg-primary/[0.03]" : ""}`}
                    style={{ height: totalHeight }}
                  >
                    {hours.map((m, idx) => (
                      <div
                        key={m}
                        className={`absolute inset-x-0 ${
                          idx === 0 ? "" : "border-t border-dashed border-border/50"
                        }`}
                        style={{ top: idx * 60 * PX_PER_MIN }}
                      />
                    ))}

                    {dayRequests.map((r) => {
                      const top = (timeToMinutes(r.start) - DAY_START) * PX_PER_MIN;
                      const height = (timeToMinutes(r.end) - timeToMinutes(r.start)) * PX_PER_MIN;
                      return (
                        <RequestBlock
                          key={r.id}
                          request={r}
                          style={{ top, height: Math.max(height, 34) }}
                          onClick={() => setSelected(r)}
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

      {/* Drawer */}
      <RequestDrawer
        request={selected}
        open={!!selected}
        onOpenChange={(open: any) => !open && setSelected(null)}
        onMutated={handleMutated}
      />
    </div>
  );
}

// ── Request block on the grid ─────────────────────────────────────

function RequestBlock({
  request,
  style,
  onClick,
}: {
  request: BookingRequest;
  style: React.CSSProperties;
  onClick: () => void;
}) {
  const styleByStatus: Record<string, string> = {
    pending:
      "border-l-amber-500 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-950/60",
    confirmed:
      "border-l-blue-500 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-950/60",
    completed: "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
    cancelled: "border-l-muted bg-muted/40 opacity-60",
    rescheduled: "border-l-purple-500 bg-purple-50 dark:bg-purple-950/40",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute left-1 right-1 cursor-pointer overflow-hidden rounded-md border-l-4 p-1.5 text-left shadow-sm transition ${styleByStatus[request.status] ?? ""}`}
      style={style}
      title={`${request.studentName} · ${request.start}–${request.end}`}
    >
      <div className="truncate text-[11px] font-semibold">
        {request.start}–{request.end}
      </div>
      <div className="truncate text-[11px]">{request.studentName}</div>
      {request.lessonType && (
        <div className="mt-0.5 hidden text-[10px] text-muted-foreground sm:block">
          {request.lessonType}
        </div>
      )}
    </button>
  );
}
