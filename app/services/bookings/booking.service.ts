/* eslint-disable @typescript-eslint/no-explicit-any */
// services/booking/booking.service.ts

import { httpClient } from "../http/client";
import { buildQueryString } from "@/lib/query-utils";
import type {
  AvailabilityParams,
  AvailabilityResponse,
  AvailableInstructorsResponse,
  Booking,
  BookingFilters,
  BookingInstructor,
  CreateBookingPayload,
  CreateBookingResult,
  PaginatedResponse,
} from "@/types/booking.types";

function unwrap<T>(body: any): T {
  return (body?.data ?? body) as T;
}

class BookingService {
  async getAvailability(params: AvailabilityParams): Promise<AvailabilityResponse> {
    const url = `/bookings/availability${buildQueryString(params)}`;
    const res = await httpClient.request<any>(url, { method: "GET" });
    const payload = unwrap<any>(res.data);

    return {
      date: payload?.date ?? "",
      slots: (payload?.slots ?? []).map((s: any) => ({
        id: s.id,
        label: s.label,
        startTime: s.startTime,
        startHour: s.startHour,
        available: s.available ?? true,
      })),
      instructors: (payload?.instructors ?? []).map((i: any) => ({
        id: i.id,
        firstName: i.user?.firstName ?? i.firstName ?? "",
        lastName: i.user?.lastName ?? i.lastName ?? "",
      })),
    };
  }

  async getAvailableInstructors(startTime: string): Promise<BookingInstructor[]> {
    const url = `/bookings/availability/instructors?startTime=${encodeURIComponent(startTime)}`;
    const res = await httpClient.request<any>(url, { method: "GET" });
    const payload = unwrap<AvailableInstructorsResponse>(res.data);
    return (payload?.instructors ?? []).map((i: any) => ({
      id: i.id,
      firstName: i.user?.firstName ?? i.firstName ?? "",
      lastName: i.user?.lastName ?? i.lastName ?? "",
    }));
  }

  async createBooking(payload: CreateBookingPayload): Promise<CreateBookingResult> {
    const res = await httpClient.request<any>("/bookings", {
      method: "POST",
      body: payload,
    });
    return unwrap<CreateBookingResult>(res.data);
  }

  async getGroup(bookingGroupId: string): Promise<Booking[]> {
    const res = await httpClient.request<any>(`/bookings/group/${bookingGroupId}`, {
      method: "GET",
    });
    return unwrap<Booking[]>(res.data);
  }

  async getBookingById(id: string): Promise<Booking> {
    const res = await httpClient.request<any>(`/bookings/${id}`, {
      method: "GET",
    });
    return unwrap<Booking>(res.data);
  }

  async getMyBookings(params: BookingFilters = {}): Promise<PaginatedResponse<Booking>> {
    const url = `/bookings/me${buildQueryString(params)}`;
    const res = await httpClient.request<any>(url, { method: "GET" });
    const payload = unwrap<PaginatedResponse<any>>(res.data);

    return {
      ...payload,
      data: (payload?.data ?? []).map((item: any) => ({
        ...item,
        instructorName:
          item.instructorName ??
          (item.instructor?.user
            ? `${item.instructor.user.firstName ?? ""} ${item.instructor.user.lastName ?? ""}`.trim()
            : null),
      })),
    };
  }

  /**
   * PATCH /bookings/:id/cancel
   * Backend: BookingStatusUpdate(id, CANCELLED, { actingUserId, reason })
   */
  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    const res = await httpClient.request<any>(`/bookings/${encodeURIComponent(id)}/cancel`, {
      method: "PATCH",
      body: { reason },
    });
    return unwrap<Booking>(res.data);
  }

  /**
   * PATCH /bookings/:id/reschedule
   * Body: { startTime: ISO8601, instructorId?: uuid }
   */
  async rescheduleBooking(
    id: string,
    payload: { startTime: string; instructorId?: string | null }
  ): Promise<Booking> {
    const res = await httpClient.request<any>(`/bookings/${encodeURIComponent(id)}/reschedule`, {
      method: "PATCH",
      body: payload,
    });
    return unwrap<Booking>(res.data);
  }
}

export const bookingService = new BookingService();
