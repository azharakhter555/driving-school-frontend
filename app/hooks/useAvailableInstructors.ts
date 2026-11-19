"use client";

import { useEffect, useState } from "react";
import { bookingService } from "@/services/bookings/booking.service";
import type { BookingInstructor } from "@/types/booking.types";

export function useAvailableInstructors(startTime: string | null) {
  const [instructors, setInstructors] = useState<BookingInstructor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!startTime) {
      setInstructors([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    bookingService
      .getAvailableInstructors(startTime)
      .then((list) => {
        if (!cancelled) setInstructors(list);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [startTime]);

  return { instructors, loading, error };
}
