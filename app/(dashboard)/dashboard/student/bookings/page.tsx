"use client";

import { useState } from "react";
import { Check, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { MonthCalendar } from "./_components/MonthCalendar";
import { TimeSlotPicker } from "./_components/TimeSlotPicker";
import { InstructorList } from "./_components/InstructorList";
import { BookingConfirmModal } from "./_components/BookingConfirmModal";
import { MyBookingsList } from "./_components/MyBookingsList";
import { useAvailability } from "@/hooks/useAvailability"; // 👈 FIXED
import { dummyBookings } from "@/lib/dummy-data/bookings.data";
import type { Booking, BookingInstructor, TimeSlot } from "@/types/booking.types";

type Step = 1 | 2;

export default function StudentBookingsPage() {
  const [step, setStep] = useState<Step>(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<BookingInstructor | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // 🚧 Local state — starts with dummy, appends on confirm
  const [userBookings, setUserBookings] = useState<Booking[]>(dummyBookings);

  const { slots, instructors, isLoading, error, refresh } = useAvailability({
    date: selectedDate,
    slotId: selectedSlot?.id,
    instructorId: selectedInstructor?.id,
    mode: "by-time",
  });

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setSelectedInstructor(null);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedInstructor(null);
  };

  const handleConfirm = () => setConfirmOpen(true);

  // Called by modal after successful booking
  const handleBookingSuccess = (booking: Booking) => {
    setUserBookings((prev) => [booking, ...prev]);
    // reset wizard for the next booking
    setStep(1);
    setSelectedSlot(null);
    setSelectedInstructor(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Book a Lesson</h1>
        <p className="text-sm text-muted-foreground">
          Pick a time that suits you — we'll match you with an instructor.
        </p>
      </div>

      <Stepper current={step} />

      {/* Step 1 */}
      {step === 1 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">1. Pick a date</h2>
            <MonthCalendar
              selectedDate={selectedDate}
              onSelectDate={(d) => {
                setSelectedDate(d);
                setSelectedSlot(null);
              }}
            />
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">2. Pick a time</h2>
            {isLoading && slots.length === 0 ? (
              <LoadingSpinner size="lg" text="Loading slots..." />
            ) : error ? (
              <ErrorState error={error} onRetry={refresh} title="Failed to load" />
            ) : (
              <TimeSlotPicker
                slots={slots}
                selected={selectedSlot}
                onSelect={handleSlotSelect}
                loading={isLoading}
              />
            )}
          </Card>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && selectedSlot && (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
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
                  Now choose an instructor (or let us pick one for you)
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Change time
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">3. Choose an instructor</h2>
            <InstructorList
              instructors={instructors}
              selected={selectedInstructor}
              onSelect={setSelectedInstructor}
              loading={isLoading}
            />
          </Card>

          <div className="sticky bottom-4 rounded-lg border bg-background p-4 shadow-lg">
            <div className="mb-3 text-sm text-muted-foreground">
              {selectedInstructor ? (
                <>
                  Booking with{" "}
                  <strong>
                    {selectedInstructor.firstName} {selectedInstructor.lastName}
                  </strong>
                </>
              ) : (
                <span className="text-amber-600 dark:text-amber-400">
                  No instructor selected — we'll assign one for you.
                </span>
              )}
            </div>
            <button
              onClick={handleConfirm}
              className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
              {selectedInstructor ? "Confirm Booking" : "Reserve Slot — We'll Assign"}
            </button>
          </div>
        </div>
      )}

      {/* 👇 Your bookings — always visible below the wizard */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Your Upcoming Lessons</h2>
            <p className="text-xs text-muted-foreground">
              {userBookings.length} booking{userBookings.length !== 1 && "s"}
            </p>
          </div>
        </div>
        <MyBookingsList bookings={userBookings} />
      </Card>

      <BookingConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        date={selectedDate}
        slot={selectedSlot}
        instructor={selectedInstructor}
        mode="by-time"
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
}

// Stepper (unchanged)
function Stepper({ current }: { current: 1 | 2 }) {
  const steps = [
    { n: 1, label: "Pick a time" },
    { n: 2, label: "Choose instructor" },
    { n: 3, label: "Confirm" },
  ];
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, idx) => {
        const done = current > s.n;
        const active = current === s.n;
        return (
          <div key={s.n} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                done
                  ? "bg-primary text-primary-foreground"
                  : active
                    ? "border-2 border-primary text-primary"
                    : "border border-muted text-muted-foreground"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : s.n}
            </div>
            <span
              className={`text-sm ${
                active ? "font-medium text-foreground" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
            {idx < steps.length - 1 && <div className="mx-2 h-px w-8 bg-border" />}
          </div>
        );
      })}
    </div>
  );
}
