// components/skeletons/ChartSkeleton.tsx
"use client";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export function ChartSkeleton() {
  return (
    <div className="h-[300px] w-full bg-muted/50 animate-pulse rounded-lg flex items-center justify-center">
      <LoadingSpinner size="md" />
    </div>
  );
}