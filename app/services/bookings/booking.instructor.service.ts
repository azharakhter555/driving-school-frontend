/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/bookings/booking.instructor.service.ts

import { httpClient } from "../http/client";
import type { BookingRequest } from "@/types/booking.types";

/** Unwrap the { success, statusCode, message, data } envelope. */
function unwrap<T>(body: any): T {
  return (body?.data ?? body) as T;
}

class BookingInstructorService {
  // ── Read: instructor's requests for a week ──────────────────
  /**
   * GET /bookings/instructor/requests?weekStart=YYYY-MM-DD
   *
   * - Identity comes from the JWT — no instructorId is sent.
   * - If `weekStart` is omitted, the backend defaults to the current
   *   Dublin week and returns only upcoming bookings.
   */
  async getRequests(weekStartISO?: string): Promise<BookingRequest[]> {
    const url = weekStartISO
      ? `/bookings/instructor/requests?weekStart=${encodeURIComponent(weekStartISO)}`
      : `/bookings/instructor/requests`;

    const res = await httpClient.request<any>(url, { method: "GET" });
    const payload = unwrap<any[]>(res.data);

    return (payload ?? []).map((r: any) => ({
      id: r.id,
      bookingGroupId: r.bookingGroupId,
      date: r.date,
      start: r.start,
      end: r.end,
      status: r.status,
      email: r.email ?? undefined, // ← add
      phone: r.phone ?? undefined,
      studentName: r.studentName ?? "",
      lessonType: r.lessonType ?? null,
    }));
  }

  // ── Write: confirm a pending request ────────────────────────
  /**
   * POST /bookings/:id/confirm
   *
   * TODO(backend): route not implemented yet. Will 404 until
   * BookingsController gets `@Post(':id/confirm')`.
   * Frontend already calls the intended path so no change is
   * needed when the backend catches up.
   */
  async confirm(id: string): Promise<void> {
    await httpClient.request<any>(`/bookings/${encodeURIComponent(id)}/confirm`, {
      method: "POST",
    });
  }

  // ── Write: cancel a request ─────────────────────────────────
  /**
   * PATCH /bookings/:id/cancel
   * (backed by `BookingsService.cancel()` on the backend)
   */
  async cancel(id: string, reason?: string): Promise<void> {
    await httpClient.request<any>(`/bookings/${encodeURIComponent(id)}/cancel`, {
      method: "PATCH",
      body: { reason },
    });
  }

  // ── Write: reschedule a request ─────────────────────────────
  /**
   * PATCH /bookings/:id/reschedule
   *
   * TODO(backend): route not implemented yet. Body will be
   * `{ startTime: ISO8601 }` (see RescheduleBookingDto).
   * Currently accepts (date, start) — the caller should build
   * the Dublin-local ISO and pass it in `start`.
   */
  async reschedule(
    id: string,
    payload: { startTime: string; instructorId?: string | null }
  ): Promise<void> {
    await httpClient.request<any>(`/bookings/${encodeURIComponent(id)}/reschedule`, {
      method: "PATCH",
      body: payload,
    });
  }
}

export const bookingsService = new BookingInstructorService();
