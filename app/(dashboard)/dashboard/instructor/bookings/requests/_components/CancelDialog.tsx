/* eslint-disable react-hooks/set-state-in-effect */
// src/app/dashboard/instructor/bookings/requests/_components/CancelDialog.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { bookingsService } from "@/services/bookings/booking.instructor.service";
import type { BookingRequest } from "@/types/booking.types";

const REASONS = [
  "Not available at this time",
  "Double-booked",
  "Outside my working hours",
  "Vehicle unavailable",
  "Other",
];

export function CancelDialog({
  request,
  open,
  onOpenChange,
  onSuccess,
}: {
  request: BookingRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [reason, setReason] = useState<string>("");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state every time the dialog opens
  useEffect(() => {
    if (open) {
      setReason("");
      setCustomReason("");
    }
  }, [open]);

  const finalReason = reason === "Other" ? customReason.trim() : reason.trim();

  const canSubmit =
    finalReason.length > 0 &&
    (reason !== "Other" || customReason.trim().length >= 3) &&
    !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await bookingsService.cancel(request.id, finalReason);
      toast.success("Booking request cancelled");
      onOpenChange(false);
      onSuccess();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to cancel");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Cancel Booking Request
          </DialogTitle>
          <DialogDescription>
            This will cancel <strong>{request.studentName}&apos;s</strong> lesson request. They will
            be notified by email and can rebook.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Reason pills */}
          <div className="space-y-2">
            <Label>Reason for cancellation</Label>
            <div className="flex flex-wrap gap-2">
              {REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    reason === r
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Custom reason textarea — only when "Other" is picked */}
          {reason === "Other" && (
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">
                Please specify <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="cancel-reason"
                placeholder="e.g. I'm sick and can't drive safely today."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                rows={3}
                maxLength={300}
              />
              <p className="text-xs text-muted-foreground">{customReason.length}/300 characters</p>
            </div>
          )}

          {/* Warning */}
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p className="text-muted-foreground">
              The student will be notified. Frequent cancellations may affect your profile rating.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Keep Request
          </Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={!canSubmit}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cancel Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
