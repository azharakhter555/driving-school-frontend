"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function TimeSlotPickerSkeleton() {
  return (
    <div className="space-y-6">
      {["Morning", "Afternoon", "Evening"].map((label) => (
        <div key={label}>
          <Skeleton className="mb-2 h-3 w-20" />
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
