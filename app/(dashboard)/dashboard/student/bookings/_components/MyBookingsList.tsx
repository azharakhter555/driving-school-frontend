// app/(dashboard)/dashboard/student/bookings/_components/MyBookingsList.tsx

"use client";

import { Calendar, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Booking } from "@/types/booking.types";

interface Props {
  bookings: Booking[];
}

export function MyBookingsList({ bookings }: Props) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        No lessons booked yet. Pick a time above to get started.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((b) => (
        <div key={b.id} className="rounded-lg border p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {new Date(b.date).toLocaleDateString("en-IE", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
                <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                <span>{b.slotLabel}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-3 w-3" />
                {b.instructorName ?? "Awaiting instructor assignment"}
              </div>
            </div>

            <Badge variant={b.status === "confirmed" ? "default" : "secondary"}>
              {b.status === "pending_assignment"
                ? "Awaiting instructor"
                : b.status === "confirmed"
                  ? "Confirmed"
                  : b.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
