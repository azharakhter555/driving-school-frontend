// src/app/dashboard/instructor/bookings/requests/_components/RescheduleDialog.tsx
"use client";

import { useEffect, useState } from "react";
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
import { Loader2, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { bookingsService } from "@/services/bookings/booking.instructor.service";
import type { BookingRequest } from "@/types/booking.types";
import { timeToMinutes } from "@/lib/week-utils";

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
  const [start, setStart] = useState(request.start);
  const [end, setEnd] = useState(request.end);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset when reopening for a different request
  useEffect(() => {
    if (open) {
      setDate(request.date);
      setStart(request.start);
      setEnd(request.end);
    }
  }, [open, request]);

  const invalid = timeToMinutes(end) <= timeToMinutes(start);
  const unchanged = date === request.date && start === request.start && end === request.end;

  const handleSubmit = async () => {
    if (invalid || unchanged) return;
    setIsSubmitting(true);
    try {
      await bookingsService.reschedule(request.id, date, start, end);
      toast.success("Booking rescheduled");
      onOpenChange(false);
      onSuccess();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to reschedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Reschedule Booking
          </DialogTitle>
          <DialogDescription>
            Propose a new time for {request.studentName}&apos;s lesson. They&apos;ll be notified.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="resched-date">New date</Label>
            <Input
              id="resched-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="resched-start">Start</Label>
              <Input
                id="resched-start"
                type="time"
                value={start}
                step={900}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resched-end">End</Label>
              <Input
                id="resched-end"
                type="time"
                value={end}
                step={900}
                onChange={(e) => setEnd(e.target.value)}
                className={invalid ? "border-destructive" : ""}
              />
            </div>
          </div>

          {invalid && <p className="text-xs text-destructive">End time must be after start.</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={invalid || unchanged || isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm New Time
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
