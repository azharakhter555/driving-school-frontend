"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Mail, PhoneCall, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { bookingService } from "@/services/bookings/booking.service";
import type { Booking } from "@/types/booking.types";

interface SuccessScreenProps {
  email: string;
  name: string;
  date: Date;
  slot: string;
  /** UUID returned by POST /bookings — used to fetch the real lesson(s) */
  bookingGroupId?: string;
  /** Phone number shown in the "reschedule" note */
  phoneNumber?: string;
}

export function SuccessScreen({
  email,
  name,
  date,
  slot,
  bookingGroupId,
  phoneNumber = "085 118 1111",
}: SuccessScreenProps) {
  const [lessons, setLessons] = useState<Booking[] | null>(null);

  useEffect(() => {
    if (!bookingGroupId) return;
    let cancelled = false;

    bookingService
      .getGroup(bookingGroupId)
      .then((rows: Booking[]) => {
        if (!cancelled) setLessons(rows);
      })
      .catch(() => {
        if (!cancelled) setLessons([]);
      });

    return () => {
      cancelled = true;
    };
  }, [bookingGroupId]);

  const isLoading = lessons === null && Boolean(bookingGroupId);
  const hasLessons = lessons !== null && lessons.length > 0;
  const hasUnassigned = hasLessons && lessons.some((b) => !b.instructorId);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-accent/40 via-background to-background px-4">
      <Card className="w-full max-w-md overflow-hidden p-0 text-center shadow-2xl">
        <div className="bg-gradient-to-br from-primary to-primary/80 px-6 py-8 text-primary-foreground">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <Check className="h-8 w-8" strokeWidth={3} />
          </div>

          <h1 className="text-2xl font-bold">
            {name ? `You're booked, ${name}!` : "You're booked in!"}
          </h1>

          {isLoading ? (
            <p className="mt-2 flex items-center justify-center gap-2 text-sm opacity-90">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading your lesson…
            </p>
          ) : hasLessons ? (
            <ul className="mt-3 space-y-1 text-sm opacity-95">
              {lessons.map((b) => {
                const instructorName = b.instructor?.user
                  ? `${b.instructor.user.firstName ?? ""} ${b.instructor.user.lastName ?? ""}`.trim()
                  : "";
                return (
                  <li key={b.id}>
                    {formatDublin(b.startTime)} – {formatDublin(b.endTime, true)}
                    {instructorName ? ` · ${instructorName}` : ""}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-1 text-sm opacity-90">
              {slot} ·{" "}
              {date.toLocaleDateString("en-IE", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          )}
        </div>

        <div className="space-y-4 p-6">
          {hasUnassigned && (
            <div className="flex items-start gap-3 rounded-xl bg-muted/60 p-4 text-left text-sm">
              <User className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <div className="font-medium">Instructor assignment</div>
                <div className="text-xs text-muted-foreground">
                  We'll match you with an instructor shortly and confirm by email.
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 rounded-xl bg-muted/60 p-4 text-left text-sm">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <div className="font-medium">Check your inbox</div>
              <div className="text-xs text-muted-foreground">
                We sent your confirmation and login details to{" "}
                <strong className="text-foreground">{email}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-muted/60 p-4 text-left text-sm">
            <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <div className="font-medium">Need to reschedule?</div>
              <div className="text-xs text-muted-foreground">
                Call us on <strong className="text-foreground">{phoneNumber}</strong> or reply to
                your confirmation email.
              </div>
            </div>
          </div>

          {bookingGroupId && (
            <p className="text-xs text-muted-foreground">
              Reference: <code className="font-mono">{bookingGroupId}</code>
            </p>
          )}

          <a
            href="/"
            className="block w-full rounded-lg bg-secondary px-4 py-3 text-center text-sm font-semibold text-secondary-foreground transition hover:bg-secondary/90"
          >
            Back to home
          </a>
        </div>
      </Card>
    </div>
  );
}

/** UTC ISO → Dublin wall-clock string. */
function formatDublin(iso: string, timeOnly = false): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-IE", {
    timeZone: "Europe/Dublin",
    ...(timeOnly
      ? { hour: "numeric", minute: "2-digit" }
      : {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "2-digit",
        }),
  }).format(d);
}
