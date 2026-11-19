// types/booking.types.ts

// ── Enums (mirror backend enums) ──
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";

export type BookingMode = "by-time" | "by-instructor" | "auto-match";

export type TransmissionType = "manual" | "automatic";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

// ── Time slot (exactly as the API returns it) ──
export interface TimeSlot {
  id: string; // "2026-11-23T09:00"
  label: string; // "9:00 am"
  startTime: string; // ISO UTC — this is what POST /bookings takes
  startHour: number; // 0–23 Dublin wall-clock, for grouping
  available: boolean;
}

// ── Instructor (API returns id + names; other fields optional) ──
export interface BookingInstructor {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  rating?: number;
  city?: string;
  transmission?: TransmissionType;
  hourlyRate?: number;
  verified?: boolean;
}

// ── Availability query params ──
export interface AvailabilityParams {
  date: string; // YYYY-MM-DD
  slotId?: string;
  instructorId?: string;
}

// ── GET /bookings/availability ──
export interface AvailabilityResponse {
  date: string;
  slots: TimeSlot[];
  instructors: BookingInstructor[];
}

// ── GET /bookings/availability/instructors?startTime=… ──
export interface AvailableInstructorsResponse {
  startTime: string;
  endTime: string;
  instructors: BookingInstructor[];
  anyAvailable: boolean;
}

// ── POST /bookings — matches CreateBookingDto ──
export interface CreateBookingClass {
  startTime: string; // ISO UTC from TimeSlot.startTime
  instructorId?: string | null; // null = assign later
  lessonType?: string; // defaults to "standard" on the server
}

export interface CreateBookingPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  classes: CreateBookingClass[]; // 1–20; server validates
}

// ── POST /bookings response ──
export interface CreateBookingResult {
  bookingGroupId: string;
  bookings: Array<{
    id: string;
    startTime: string;
    endTime: string;
    instructorId: string | null;
    status: BookingStatus;
  }>;
}

// ── GET /bookings/group/:bookingGroupId ──
export interface Booking {
  id: string;
  bookingGroupId: string | null;
  startTime: string; // ISO UTC
  endTime: string;
  instructorId: string | null;
  status: BookingStatus;
  lessonType: string | null;
  notes: string | null;
  instructor: {
    id: string;
    user?: { firstName?: string; lastName?: string };
  } | null;
}

// ── Filters for "My Bookings" list ──
export interface BookingFilters {
  status?: BookingStatus;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  page?: number;
  limit?: number;
  search?: string;
}

// ── Admin/instructor request view (unchanged from your original) ──
export interface BookingRequest {
  id: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  studentAvatarUrl?: string;
  date: string;
  start: string;
  end: string;
  status: BookingStatus;
  lessonType: string;
  pickupLocation?: string;
  notes?: string;
  requestedAt: string;
  price?: number;
}

export type RequestFilter = "pending" | "confirmed" | "all";
