/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/instructor/bookings/requests/_components/RequestDrawer.tsx
"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  X,
  CalendarClock,
  Phone,
  Mail,
  MapPin,
  Clock,
  Car,
  Loader2,
  Euro,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { bookingsService } from "@/services/bookings/booking.instructor.service";
import type { BookingRequest } from "@/types/booking.types";
import { RescheduleDialog } from "./RescheduleDialog";
import { CancelDialog } from "./CancelDialog";

const STATUS_STYLES: Record<string, string> = {
  pending:
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800",
  confirmed:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800",
  completed:
    "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-800",
  cancelled: "bg-muted text-muted-foreground border-border",
  rescheduled:
    "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-800",
};

export function RequestDrawer({
  request,
  open,
  onOpenChange,
  onMutated,
}: {
  request: BookingRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMutated: () => void;
}) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  if (!request) return null;

  const dateObj = new Date(request.date + "T00:00:00");
  const weekday = dateObj.toLocaleDateString("en-IE", { weekday: "long" });
  const dateFull = dateObj.toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const requestedAt = new Date(request.requestedAt).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const initials = request.studentName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await bookingsService.confirm(request.id);
      toast.success("Booking confirmed");
      onMutated();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to confirm");
    } finally {
      setIsConfirming(false);
    }
  };

  const isPending = request.status === "pending";
  const isConfirmed = request.status === "confirmed";
  const hasActions = isPending || isConfirmed;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
          {/* ── Header ── */}
          <SheetHeader className="space-y-0 border-b p-6 pb-4">
            <div className="flex items-center justify-between gap-3">
              <SheetTitle className="text-base">Booking Request</SheetTitle>
              <Badge
                variant="outline"
                className={`capitalize ${STATUS_STYLES[request.status] ?? ""}`}
              >
                {request.status}
              </Badge>
            </div>
            <p className="pt-1 text-xs text-muted-foreground">Requested {requestedAt}</p>
          </SheetHeader>

          {/* ── Scrollable body ── */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* ── Hero: when + who ── */}
              <div className="rounded-lg border bg-muted/30 p-4">
                {/* When */}
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-background p-2">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      When
                    </div>
                    <div className="mt-0.5 font-semibold">{weekday}</div>
                    <div className="text-sm text-muted-foreground">{dateFull}</div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium text-foreground">
                        {request.start} – {request.end}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Who */}
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Student
                    </div>
                    <div className="truncate font-semibold">{request.studentName}</div>
                  </div>
                </div>
              </div>

              {/* ── Contact ── */}
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Contact
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  <ContactRow
                    icon={<Phone className="h-4 w-4" />}
                    label={request.phone}
                    href={`tel:${request.phone}`}
                  />
                  <ContactRow
                    icon={<Mail className="h-4 w-4" />}
                    label={request.email}
                    href={`mailto:${request.email}`}
                  />
                </div>
              </section>

              {/* ── Lesson details ── */}
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Lesson
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <Stat
                    icon={<Car className="h-3.5 w-3.5" />}
                    label="Type"
                    value={request.lessonType}
                  />
                  {typeof request.price === "number" && (
                    <Stat
                      icon={<Euro className="h-3.5 w-3.5" />}
                      label="Price"
                      value={`€${request.price}`}
                    />
                  )}
                  {request.pickupLocation && (
                    <div className="col-span-2">
                      <Stat
                        icon={<MapPin className="h-3.5 w-3.5" />}
                        label="Pickup location"
                        value={request.pickupLocation}
                      />
                    </div>
                  )}
                </div>
              </section>

              {/* ── Note ── */}
              {request.notes && (
                <section>
                  <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Student&apos;s note
                  </h3>
                  <div className="rounded-lg border bg-muted/30 p-3 text-sm leading-relaxed">
                    {request.notes}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* ── Sticky action footer ── */}
          {hasActions && (
            <div className="border-t bg-background p-4">
              <div className="space-y-2">
                {isPending && (
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    onClick={handleConfirm}
                    disabled={isConfirming}
                  >
                    {isConfirming ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Confirm Booking
                  </Button>
                )}

                {(isPending || isConfirmed) && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => setIsRescheduleOpen(true)}
                    >
                      <CalendarClock className="h-4 w-4" />
                      Reschedule
                    </Button>

                    <Button
                      variant="outline"
                      className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setIsCancelOpen(true)}
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {!hasActions && (
            <div className="border-t bg-muted/30 p-4">
              <p className="text-center text-xs text-muted-foreground">
                This request is {request.status}. No actions available.
              </p>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <RescheduleDialog
        request={request}
        open={isRescheduleOpen}
        onOpenChange={setIsRescheduleOpen}
        onSuccess={onMutated}
      />

      <CancelDialog
        request={request}
        open={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        onSuccess={onMutated}
      />
    </>
  );
}

// ── Small primitives ──────────────────────────────────────────────

function ContactRow({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: any | string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 rounded-lg border p-3 text-sm transition hover:border-primary/40 hover:bg-primary/5"
    >
      <span className="text-muted-foreground transition group-hover:text-primary">{icon}</span>
      <span className="truncate">{label}</span>
    </a>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: any }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-0.5 text-sm font-medium">{value}</div>
    </div>
  );
}
