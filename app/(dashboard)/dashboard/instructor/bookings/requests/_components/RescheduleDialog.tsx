"use client";
// src/app/dashboard/instructor/bookings/requests/_components/RescheduleDialog.tsx

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, CalendarClock, Inbox } from "lucide-react";
import { toast } from "sonner";
import {
  bookingsService,
  type AvailabilitySlot,
} from "@/services/bookings/booking.instructor.service";
import type { BookingRequest } from "@/types/booking.types";

export function RescheduleDialog({
  request,
  open,
  onOpenChange,
  onSuccess,
}: {
  request: BookingRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [date, setDate] = useState(request.date);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [reason, setReason] = useState("");
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // ── Reset helpers (called from event handlers, NOT the effect) ──
  const resetForOpen = useCallback(() => {
    setDate(request.date);
    setSelectedSlot(null);
    setReason("");
    setLoadError(null);
    setIsLoadingSlots(true);
  }, [request.date]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (next) resetForOpen();
      onOpenChange(next);
    },
    [resetForOpen, onOpenChange]
  );

  const handleDateChange = useCallback((next: string) => {
    setDate(next);
    setSelectedSlot(null);
    setLoadError(null);
    setIsLoadingSlots(true);
  }, []);

  // ── Effect: ONLY async setState ─────────────────────────────
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    bookingsService
      .getAvailability(date, request.instructorId)
      .then((data) => {
        if (!cancelled) setSlots(data);
      })
      .catch((e) => {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "Failed to load slots");
          setSlots([]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, date, request.instructorId]);

  const handleSubmit = async () => {
    if (!selectedSlot) return;
    setIsSubmitting(true);
    try {
      await bookingsService.reschedule(request.id, {
        startTime: selectedSlot.startTime,
        reason: reason.trim() || undefined,
      });
      toast.success("Booking rescheduled");
      onOpenChange(false);
      onSuccess();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to reschedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  // The booking's current slot — can't be selected on the same date
  const currentKey = date === request.date ? request.start : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Reschedule Booking
          </DialogTitle>
          <DialogDescription>
            Pick a new time for {request.studentName}&apos;s lesson. Only slots where you&apos;re
            free and unbooked are shown.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="resched-date">New date</Label>
            <Input
              id="resched-date"
              type="date"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </div>

          {/* Slots */}
          <div className="space-y-2">
            <Label>Available times</Label>

            {isLoadingSlots ? (
              <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading slots…
              </div>
            ) : loadError ? (
              <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                {loadError}
              </div>
            ) : slots.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-md border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                <Inbox className="h-6 w-6" />
                No available slots on this date. Try another day.
              </div>
            ) : (
              <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto pr-1">
                {slots.map((slot) => {
                  const isCurrent =
                    currentKey !== null && slot.startTime.slice(11, 16) === currentKey;
                  const isSelected = selectedSlot?.id === slot.id;
                  return (
                    <Button
                      key={slot.id}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      disabled={isCurrent}
                      onClick={() => setSelectedSlot(slot)}
                      className="justify-center"
                      title={isCurrent ? "Current time" : slot.label}
                    >
                      {slot.label}
                      {isCurrent && (
                        <Badge variant="secondary" className="ml-1 text-[9px]">
                          Now
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="resched-reason">
              Reason{" "}
              <span className="text-xs font-normal text-muted-foreground">
                (optional, shared with student)
              </span>
            </Label>
            <textarea
              id="resched-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Car broke down, unavoidable clash, weather…"
              maxLength={500}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-right text-[11px] text-muted-foreground">{reason.length}/500</p>
          </div>

          {/* Summary */}
          {selectedSlot && (
            <div className="rounded-md bg-muted/40 p-3 text-sm">
              <span className="text-muted-foreground">New time: </span>
              <span className="font-medium">
                {date} · {selectedSlot.label}
              </span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedSlot || isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm New Time
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
