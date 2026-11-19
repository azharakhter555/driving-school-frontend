// app/dashboard/admin/instructors/_components/EditDriverModal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { driverService } from "@/services/driver/driver.service";
import { toast } from "sonner";
import type { Instructor } from "@/types/instructor.types";

interface EditDriverModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: Instructor | null;
  onSuccess: () => void;
}

export function EditDriverModalApprove({
  open,
  onOpenChange,
  driver,
  onSuccess,
}: EditDriverModalProps) {
  const [approvalStatus, setApprovalStatus] = useState<string>("pending");
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state when the selected driver changes
  useEffect(() => {
    if (driver) {
      setApprovalStatus(driver.approvalStatus || "pending");
      setIsApproved(driver.isApproved ?? false);
    }
  }, [driver]);

  // Auto-sync: approving implies isApproved=true
  const handleStatusChange = (value: string) => {
    setApprovalStatus(value);
    if (value === "approved") setIsApproved(true);
    if (value === "rejected") setIsApproved(false);
  };

  const handleSubmit = async () => {
    if (!driver) return;
    setIsSubmitting(true);
    try {
      // Only these two fields — nothing else
      await driverService.updateDriver(driver.id, {
        approvalStatus,
        isApproved,
      } as any);
      toast.success("Instructor approval updated");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Review Instructor</DialogTitle>
          <DialogDescription>
            Update the approval status for{" "}
            <span className="font-medium text-foreground">
              {driver?.firstName} {driver?.lastName}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="approvalStatus">Approval Status</Label>
            <Select value={approvalStatus} onValueChange={handleStatusChange}>
              <SelectTrigger id="approvalStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isApproved">Verified</Label>
            <Select
              value={isApproved ? "true" : "false"}
              onValueChange={(v) => setIsApproved(v === "true")}
            >
              <SelectTrigger id="isApproved">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes — Verified</SelectItem>
                <SelectItem value="false">No — Not Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
