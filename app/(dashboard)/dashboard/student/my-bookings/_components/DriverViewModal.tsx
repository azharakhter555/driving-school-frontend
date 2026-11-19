"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DriverView } from "./DriverView";
import type { Instructor } from "@/types/instructor.types";

interface DriverViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instructor: Instructor | null;
}

export function DriverViewModal({ open, onOpenChange, instructor }: DriverViewModalProps) {
  if (!instructor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Instructor Details</DialogTitle>
        </DialogHeader>
        <DriverView instructor={instructor} />
      </DialogContent>
    </Dialog>
  );
}
