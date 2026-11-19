// components/skeletons/InstructorListSkeleton.tsx

"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function InstructorListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4">
          <div className="flex items-start gap-3">
            {/* avatar */}
            <Skeleton className="h-12 w-12 rounded-full" />

            {/* name + meta + price */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" /> {/* name */}
              <Skeleton className="h-3 w-3/4" /> {/* rating · city · transmission */}
              <Skeleton className="h-4 w-1/4" /> {/* €xx/hr */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
