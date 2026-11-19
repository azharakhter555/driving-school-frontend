"use client";

import { useEffect, useState, useCallback } from "react";
import { bookingService } from "@/services/bookings/booking.service"; // ← singular; see note above
import type { BookingInstructor, BookingMode, TimeSlot } from "@/types/booking.types";

export function useAvailability(params: {
  date: Date;
  instructorId?: string;
  /** Deprecated — kept for API compatibility with older callers. */
  mode?: BookingMode;
}) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [instructors, setInstructors] = useState<BookingInstructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // canonical YYYY-MM-DD in Europe/Dublin
  const dateStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Dublin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(params.date);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingService.getAvailability({
        date: dateStr,
        instructorId: params.instructorId,
      });
      setSlots(data.slots);
      setInstructors(data.instructors);
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setSlots([]);
      setInstructors([]);
    } finally {
      setIsLoading(false);
    }
  }, [dateStr, params.instructorId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { slots, instructors, isLoading, error, refresh: fetchData };
}
