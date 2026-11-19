// app/(dashboard)/dashboard/admin/overview/page.tsx
"use client";

import { useMemo } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { ErrorState } from "@/components/shared/ErrorState";
import { DashboardHeader } from "./_components/DashboardHeader";
import { DashboardStats } from "./_components/DashboardStats";
import { DashboardCharts } from "./_components/DashboardCharts";
import { DashboardSkeleton } from "./_components/DashboardSkeleton";

export default function AdminOverviewPage() {
  const { data, error, isLoading, isRefreshing, refresh } = useDashboard();

  const lastUpdated = useMemo(() => {
    return new Date().toLocaleDateString("en-IE", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }, []);

  if (isLoading) return <DashboardSkeleton />;

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={refresh}
        title="Failed to load dashboard"
        fullPage
      />
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        onRefresh={refresh}
      />
      <DashboardStats stats={data?.stats} />
      <DashboardCharts 
        data={data} 
        isLoading={false}
        error={null}
        onRetry={refresh}
      />
    </div>
  );
}