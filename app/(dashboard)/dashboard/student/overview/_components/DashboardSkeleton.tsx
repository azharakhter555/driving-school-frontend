// app/(dashboard)/dashboard/admin/overview/_components/DashboardSkeleton.tsx
"use client";

import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-muted animate-pulse rounded" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        </div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>

      {/* Charts row 1 skeleton */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Charts row 2 skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <ChartSkeleton />
        </div>
        <div className="md:col-span-1">
          <ChartSkeleton />
        </div>
      </div>

      {/* Charts row 3 skeleton */}
      <div className="grid gap-4">
        <ChartSkeleton />
      </div>
    </div>
  );
}