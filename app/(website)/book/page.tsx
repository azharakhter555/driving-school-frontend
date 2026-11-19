"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ChevronRight,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Loader2,
  ShieldCheck,
  Sun,
  Sunset,
  Moon,
  Star,
  MapPin,
  BadgeCheck,
  Car,
  PhoneCall,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAvailability } from "@/hooks/useAvailability";
import { useAvailableInstructors } from "@/hooks/useAvailableInstructors";
import { bookingService } from "@/services/bookings/booking.service";

import { TrustPill } from "@/components/shared/TrustPill";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Field } from "@/components/shared/Field";
import { ErrorState } from "@/components/shared/ErrorState";

import { Stepper, type Step } from "./_components/Stepper";
import { InstructorCard } from "./_components/InstructorCard";
import { LoadingState } from "./_components/LoadingState";
import { EmptyState } from "./_components/EmptyState";
import { DateStrip } from "./_components/DateStrip";
import { SuccessScreen } from "./_components/SuccessScreen";

import type { BookingInstructor, TimeSlot } from "@/types/booking.types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IE_PHONE_RE = /^(\+353|0)\d{7,10}$/;
const LESSON_PRICE = 45;

interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function PublicBookPage() {
  const [step, setStep] = useState<Step>(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<BookingInstructor | null>(null);
  const [details, setDetails] = useState<GuestDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [bookingGroupId, setBookingGroupId] = useState<string | null>(null);

  // slots for the day (step 1)
  const {
    slots,
    isLoading,
    error: availError,
    refresh,
  } = useAvailability({
    date: selectedDate,
    mode: "by-time",
  });

  // instructors for the picked slot (step 2)
  const {
    instructors: availableInstructors,
    loading: instructorsLoading,
    error: instructorsError,
  } = useAvailableInstructors(selectedSlot?.startTime ?? null);

  // clear stale instructor when slot changes
  useEffect(() => {
    if (!selectedInstructor || instructorsLoading) return;
    if (!availableInstructors.some((i) => i.id === selectedInstructor.id)) {
      setSelectedInstructor(null);
    }
  }, [availableInstructors, instructorsLoading, selectedInstructor]);

  // group by startHour (Dublin wall-clock, from API)
  const groupedSlots = useMemo(() => {
    const groups = {
      morning: { label: "Morning", icon: Sun, slots: [] as TimeSlot[] },
      afternoon: { label: "Afternoon", icon: Sunset, slots: [] as TimeSlot[] },
      evening: { label: "Evening", icon: Moon, slots: [] as TimeSlot[] },
    };
    for (const slot of slots) {
      if (slot.startHour < 12) groups.morning.slots.push(slot);
      else if (slot.startHour < 17) groups.afternoon.slots.push(slot);
      else groups.evening.slots.push(slot);
    }
    return Object.values(groups).filter((g) => g.slots.length > 0);
  }, [slots]);

  const detailsValid =
    details.firstName.trim().length >= 2 &&
    details.lastName.trim().length >= 2 &&
    EMAIL_RE.test(details.email) &&
    IE_PHONE_RE.test(details.phone.replace(/\s/g, ""));

  const canSubmit =
    selectedSlot !== null &&
    detailsValid &&
    !submitting &&
    !instructorsLoading &&
    availableInstructors.length > 0;

  const MIN_SUBMIT_MS = 700; // visible "Booking..." time

  const handleSubmit = async () => {
    if (!selectedSlot || !detailsValid) return;
    setSubmitting(true);
    setError(null);
    try {
      // run the request and the minimum-wait in parallel — whichever is slower wins
      const [created] = await Promise.all([
        bookingService.createBooking({
          firstName: details.firstName.trim(),
          lastName: details.lastName.trim(),
          email: details.email.trim().toLowerCase(),
          phone: details.phone.trim(),
          classes: [
            {
              startTime: selectedSlot.startTime,
              instructorId: selectedInstructor?.id ?? null,
            },
          ],
        }),
        new Promise((r) => setTimeout(r, MIN_SUBMIT_MS)),
      ]);
      setBookingGroupId(created.bookingGroupId);
      setSuccess(true);
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? "Booking failed. Please try again.";
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <SuccessScreen
        email={details.email}
        name={details.firstName}
        date={selectedDate}
        slot={selectedSlot?.label ?? ""}
        bookingGroupId={bookingGroupId ?? undefined}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 via-background to-background">
      {/* ===== Header ===== */}
      <header className="relative overflow-hidden border-b bg-card">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #1a5a5a 0, transparent 50%), radial-gradient(circle at 80% 80%, #c46a3a 0, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                <Car className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-base font-semibold leading-tight">Book a Lesson</span>
                <span className="block text-xs text-muted-foreground">Takes about 30 seconds</span>
              </div>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <TrustPill icon={<ShieldCheck className="h-3.5 w-3.5" />} label="No account needed" />
              <TrustPill icon={<BadgeCheck className="h-3.5 w-3.5" />} label="RSA approved" />
            </div>
          </div>

          {step === 1 && (
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                <strong className="text-foreground">5.0</strong> from 1,200+ pupils
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Dublin City & surrounding areas
              </span>
              <span className="flex items-center gap-1.5">
                <PhoneCall className="h-3.5 w-3.5" /> 085 118 1111
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Stepper current={step} />

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="mt-6 space-y-6 animate-[fadeUp_0.4s_ease-out]">
            <section>
              <SectionHeader
                icon={<Calendar className="h-4 w-4" />}
                title="Pick a day"
                subtitle="Next 14 days available Or Select a custom date"
              />
              <DateStrip
                selectedDate={selectedDate}
                onSelectDate={(d) => {
                  setSelectedDate(d);
                  setSelectedSlot(null);
                  setSelectedInstructor(null);
                }}
              />
            </section>

            <section>
              <SectionHeader
                icon={<Clock className="h-4 w-4" />}
                title="Pick a time"
                subtitle={selectedDate.toLocaleDateString("en-IE", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              />

              {isLoading && slots.length === 0 ? (
                <LoadingState />
              ) : availError ? (
                <ErrorState
                  title="Could not load times"
                  message="Please check your connection and try again."
                  error={availError instanceof Error ? availError : undefined}
                  onRetry={refresh}
                />
              ) : slots.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-5">
                  {groupedSlots.map((group) => {
                    const Icon = group.icon;
                    return (
                      <div key={group.label}>
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <Icon className="h-3.5 w-3.5" />
                          {group.label}
                        </div>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                          {group.slots.map((slot) => (
                            <button
                              key={slot.id}
                              onClick={() => {
                                setSelectedSlot(slot);
                                setStep(2);
                              }}
                              className="group relative rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5 hover:text-primary hover:shadow-sm"
                            >
                              {slot.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && selectedSlot && (
          <div className="mt-6 space-y-6 animate-[fadeUp_0.4s_ease-out]">
            <Card className="flex flex-wrap items-center justify-between gap-4 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="text-sm">
                  <div className="font-semibold">
                    {selectedSlot.label} ·{" "}
                    {selectedDate.toLocaleDateString("en-IE", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </div>
                  <div className="text-muted-foreground">
                    {selectedInstructor
                      ? `with ${selectedInstructor.firstName} ${selectedInstructor.lastName}`
                      : "We'll assign the best available instructor"}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Change time
              </Button>
            </Card>

            {/* Instructor section — real per-slot list */}
            <section>
              <SectionHeader
                icon={<User className="h-4 w-4" />}
                title="Choose your instructor"
                subtitle="Optional — skip if you'd like us to assign one"
              />

              {instructorsLoading ? (
                <LoadingState />
              ) : instructorsError ? (
                <ErrorState
                  title="Could not load instructors"
                  message="Please try again."
                  error={instructorsError}
                />
              ) : availableInstructors.length === 0 ? (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                  That time just filled up. Please go back and choose another time.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <InstructorCard
                    active={!selectedInstructor}
                    onClick={() => setSelectedInstructor(null)}
                    fallback
                  />
                  {availableInstructors.map((ins) => (
                    <InstructorCard
                      key={ins.id}
                      instructor={ins}
                      active={selectedInstructor?.id === ins.id}
                      onClick={() => setSelectedInstructor(ins)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Contact details */}
            <section>
              <SectionHeader
                icon={<Mail className="h-4 w-4" />}
                title="Your details"
                subtitle="We'll email your confirmation and login"
              />
              <Card className="space-y-4 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="firstName" label="First name">
                    <Input
                      id="firstName"
                      value={details.firstName}
                      onChange={(e) => setDetails((d) => ({ ...d, firstName: e.target.value }))}
                      placeholder="Aoife"
                      autoComplete="given-name"
                    />
                  </Field>
                  <Field id="lastName" label="Last name">
                    <Input
                      id="lastName"
                      value={details.lastName}
                      onChange={(e) => setDetails((d) => ({ ...d, lastName: e.target.value }))}
                      placeholder="Murphy"
                      autoComplete="family-name"
                    />
                  </Field>
                  <Field id="email" label="Email" icon={<Mail className="h-4 w-4" />}>
                    <Input
                      id="email"
                      type="email"
                      value={details.email}
                      onChange={(e) => setDetails((d) => ({ ...d, email: e.target.value }))}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </Field>
                  <Field id="phone" label="Mobile" icon={<Phone className="h-4 w-4" />}>
                    <Input
                      id="phone"
                      type="tel"
                      value={details.phone}
                      onChange={(e) => setDetails((d) => ({ ...d, phone: e.target.value }))}
                      placeholder="085 118 1111"
                      autoComplete="tel"
                    />
                  </Field>
                </div>
                <p className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  We'll create your account and email your login so you can manage this booking
                  anytime.
                </p>
              </Card>
            </section>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="sticky bottom-4 z-10">
              <Card className="flex flex-wrap items-center justify-between gap-4 border-primary/30 p-4 shadow-xl">
                <div>
                  <div className="text-xs text-muted-foreground">Total for 1 lesson</div>
                  <div className="text-2xl font-bold text-primary">€{LESSON_PRICE}</div>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="h-12 flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 sm:flex-none sm:px-8"
                  size="lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking...
                    </>
                  ) : (
                    <>
                      Confirm booking <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </Card>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
