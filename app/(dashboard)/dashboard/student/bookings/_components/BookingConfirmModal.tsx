// app/(dashboard)/dashboard/student/bookings/_components/BookingConfirmModal.tsx

"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Booking, BookingInstructor, TimeSlot } from "@/types/booking.types";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  date: Date;
  slot: TimeSlot | null;
  instructor: BookingInstructor | null;
  mode: string;
  onSuccess?: (booking: Booking) => void; // 👈 new
}

export function BookingConfirmModal({
  open,
  onOpenChange,
  date,
  slot,
  instructor,
  mode,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const isPendingAssignment = !instructor;

  const handleConfirm = async () => {
    if (!slot) return;
    setLoading(true);

    // 🚧 DUMMY — replace with real API later
    await new Promise((r) => setTimeout(r, 500));

    const booking: Booking = {
      id: `bk-${Date.now()}`,
      date: date.toISOString(),
      slotId: slot.id,
      slotLabel: slot.label,
      instructorId: instructor?.id ?? null,
      instructorName: instructor ? `${instructor.firstName} ${instructor.lastName}` : null,
      status: instructor ? "confirmed" : "pending_assignment",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    toast.success(
      isPendingAssignment
        ? "Slot reserved! We'll email you once an instructor is assigned."
        : "Booking confirmed!"
    );

    onSuccess?.(booking);
    onOpenChange(false);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isPendingAssignment ? "Reserve this slot?" : "Confirm your booking"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <Row
            label="Date"
            value={date.toLocaleDateString("en-IE", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          />
          <Row label="Time" value={slot?.label ?? "—"} />
          <Row
            label="Instructor"
            value={
              instructor
                ? `${instructor.firstName} ${instructor.lastName}`
                : "Will be assigned (usually within 24h)"
            }
          />
        </div>

        {isPendingAssignment && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
            Your slot will be reserved. An admin will assign an available instructor and you'll get
            an email confirmation. You can cancel anytime before the lesson.
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? "Booking..." : isPendingAssignment ? "Reserve Slot" : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
