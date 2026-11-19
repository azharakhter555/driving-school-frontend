// app/(dashboard)/dashboard/admin/overview/_components/DashboardCharts.tsx
"use client";

import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { RevenueChart, BookingsChart } from "@/components/charts";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";
import { ChartErrorFallback } from "@/components/shared/ChartErrorFallback";
import type { DashboardData } from "@/services";

const UserGrowthChart = lazy(() =>
  import("@/components/charts").then((m) => ({ default: m.UserGrowthChart }))
);
const BookingStatusPieChart = lazy(() =>
  import("@/components/charts").then((m) => ({ default: m.BookingStatusPieChart }))
);
const TopInstructorsChart = lazy(() =>
  import("@/components/charts").then((m) => ({ default: m.TopInstructorsChart }))
);

interface DashboardChartsProps {
  data?: DashboardData;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export function DashboardCharts({ 
  data, 
  isLoading, 
  error, 
  onRetry 
}: DashboardChartsProps) {
  return (
    <>
      {/* Row 1 - Eager loaded charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <ErrorBoundary FallbackComponent={ChartErrorFallback}>
          <RevenueChart 
            data={data?.revenue} 
            isLoading={isLoading}
            error={error}
            onRetry={onRetry}
          />
        </ErrorBoundary>
        <ErrorBoundary FallbackComponent={ChartErrorFallback}>
          <BookingsChart 
            data={data?.bookings} 
            isLoading={isLoading}
            error={error}
            onRetry={onRetry}
          />
        </ErrorBoundary>
      </div>

      {/* Row 2 - Lazy loaded charts */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <ErrorBoundary FallbackComponent={ChartErrorFallback}>
            <Suspense fallback={<ChartSkeleton />}>
              <UserGrowthChart 
                data={data?.userGrowth} 
                isLoading={isLoading}
                error={error}
                onRetry={onRetry}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
        <div className="md:col-span-1">
          <ErrorBoundary FallbackComponent={ChartErrorFallback}>
            <Suspense fallback={<ChartSkeleton />}>
              <BookingStatusPieChart 
                data={data?.bookingStatus} 
                isLoading={isLoading}
                error={error}
                onRetry={onRetry}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>

      {/* Row 3 - Lazy loaded chart */}
      <div className="grid gap-4 md:grid-cols-1">
        <ErrorBoundary FallbackComponent={ChartErrorFallback}>
          <Suspense fallback={<ChartSkeleton />}>
            <TopInstructorsChart 
              data={data?.topInstructors} 
              isLoading={isLoading}
              error={error}
              onRetry={onRetry}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
}