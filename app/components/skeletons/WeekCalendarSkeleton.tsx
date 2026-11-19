"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function WeekCalendarSkeleton() {
  return (
    <div>
      {/* header */}
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>

      {/* day grid */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
