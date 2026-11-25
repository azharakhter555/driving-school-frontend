/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/bookings/booking.instructor.service.ts

import { httpClient } from "../http/client";
import type { BookingRequest, BookingStatus } from "@/types/booking.types";

/** Unwrap the { success, statusCode, message, data } envelope. */
function unwrap<T>(body: any): T {
  return (body?.data ?? body) as T;
}

export interface AvailabilitySlot {
  id: string; // e.g. "2026-11-26T10:00"
  label: string; // e.g. "10:00 am"
  startTime: string; // ISO
  startHour: number;
  available: boolean;
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
      instructorId: r.instructorId ?? "",
      date: r.date,
      start: r.start,
      end: r.end,
      status: r.status,
      email: r.email ?? undefined,
      phone: r.phone ?? undefined,
      studentName: r.studentName ?? "",
      lessonType: r.lessonType ?? null,
    }));
  }

  // ── Write: single endpoint for ALL status changes ───────────
  /**
   * PATCH /bookings/:id/status
   * Body: { status: BookingStatus, reason?: string }
   *
   * Backend: BookingStatusUpdate(id, status, { actingUserId, reason })
   *
   * This is the only mutating route. `confirm()` / `cancel()` below
   * are thin semantic wrappers so callers stay readable.
   */
  async updateStatus(id: string, status: BookingStatus, reason?: string): Promise<BookingRequest> {
    const res = await httpClient.request<any>(`/bookings/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: { status, reason },
    });
    return unwrap<BookingRequest>(res.data);
  }

  // ── Read: available slots for a date (for this instructor) ──
  /**
   * GET /bookings/availability?date=YYYY-MM-DD&instructorId=<uuid>
   *
   * The backend already excludes slots where the instructor is:
   *  - not on their availability roster
   *  - already booked (pending/confirmed)
   * So any slot returned here is safe to pick.
   */
  async getAvailability(date: string, instructorId: string): Promise<AvailabilitySlot[]> {
    const params = new URLSearchParams({ date });
    if (instructorId) params.set("instructorId", instructorId);

    const res = await httpClient.request<any>(`/bookings/availability?${params.toString()}`, {
      method: "GET",
    });
    const payload = unwrap<any>(res.data);
    return (payload?.slots ?? []) as AvailabilitySlot[];
  }

  // ── Write: reschedule ───────────────────────────────────────
  /**
   * PATCH /bookings/:id/reschedule
   * Body: { startTime: ISO8601 }
   *
   * Status is preserved (a pending booking stays pending after
   * reschedule). `endTime` is computed by the backend from
   * LESSON_MINUTES.
   */
  async reschedule(
    id: string,
    payload: {
      startTime: string;
      reason?: string;
    }
  ): Promise<BookingRequest> {
    const res = await httpClient.request<any>(`/bookings/${encodeURIComponent(id)}/reschedule`, {
      method: "PATCH",
      body: payload,
    });

    return res.data?.data ?? res.data;
  }
  // ── Convenience wrappers (drawer calls these) ───────────────

  /** PENDING → CONFIRMED */
  async confirm(id: string): Promise<BookingRequest> {
    return this.updateStatus(id, "confirmed");
  }

  /** PENDING/CONFIRMED → CANCELLED */
  async cancel(id: string, reason?: string): Promise<BookingRequest> {
    return this.updateStatus(id, "cancelled", reason);
  }

  /** CONFIRMED → NO_SHOW */
  async markNoShow(id: string, reason?: string): Promise<BookingRequest> {
    return this.updateStatus(id, "no_show", reason);
  }

  /** CONFIRMED → COMPLETED */
  async complete(id: string): Promise<BookingRequest> {
    return this.updateStatus(id, "completed");
  }
}

export const bookingsService = new BookingInstructorService();
