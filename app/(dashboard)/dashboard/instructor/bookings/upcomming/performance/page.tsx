// app/dashboard/admin/drivers/performance/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable/DataTable-1";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { RefreshCw } from "lucide-react";
import { FilterBar, useFilters } from "@/components/shared/filters";
import { buildQueryParams } from "@/lib/filter-utils";
import { useTableData } from "@/hooks/useTableData";

import { PerformanceColumns } from "./tableColumns";
import { performanceService } from "@/services/performance/performance.service";
import type { InstructorPerformance, PerformanceKpis } from "@/types/performance.types";
import { performanceFilters } from "./_components/performance-filters.config";
import { PerformanceKpiCards } from "./_components/PerformanceKpiCards";
import { PerformanceDetailModal } from "./_components/PerformanceDetailModal";

export default function PerformanceReviewsPage() {
  const [viewing, setViewing] = useState<InstructorPerformance | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [kpis, setKpis] = useState<PerformanceKpis | null>(null);
  const [kpisLoading, setKpisLoading] = useState(true);

  const {
    values: filters,
    setFilter,
    setFilters,
    resetFilters,
    activeCount,
  } = useFilters(performanceFilters);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const apiParams = useMemo(
    () =>
      buildQueryParams(performanceFilters, filters, {
        extra: { page, limit: pageSize },
      }),
    [filters, page, pageSize]
  );

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const { data, isLoading, error, refresh } = useTableData<InstructorPerformance>(
    performanceService.getInstructorPerformance,
    apiParams
  );

  // ── KPI fetch ──
  const loadKpis = useCallback(async () => {
    setKpisLoading(true);
    try {
      const res = await performanceService.getKpis();
      setKpis(res.data);
    } catch {
      // silent — KPIs are decorative
    } finally {
      setKpisLoading(false);
    }
  }, []);

  useEffect(() => {
    loadKpis();
  }, [loadKpis]);

  const handleRefresh = () => {
    refresh();
    loadKpis();
  };

  const handleApplyFilters = (newFilters: any) => setFilters(newFilters);

  const handleView = useCallback((row: InstructorPerformance) => {
    setViewing(row);
    setIsViewOpen(true);
  }, []);

  const columns = useMemo(() => PerformanceColumns(handleView), [handleView]);

  const rows = data?.data || [];
  const total = data?.total || rows.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Reviews</h1>
          <p className="text-sm text-muted-foreground">
            Ratings, pass rates, and response times across your instructor team.
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="icon" title="Refresh">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* KPI Cards */}
      <PerformanceKpiCards kpis={kpis} loading={kpisLoading} />

      {/* Filters */}
      <FilterBar
        configs={performanceFilters}
        values={filters}
        onFilterChange={setFilter}
        onReset={resetFilters}
        activeCount={activeCount}
        onApply={handleApplyFilters}
      />

      {/* Table */}
      {isLoading && rows.length === 0 ? (
        <LoadingSpinner size="lg" text="Loading performance data..." />
      ) : error ? (
        <ErrorState error={error} onRetry={refresh} title="Failed to load performance data" />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          variant="default"
          density="normal"
          searchable
          searchPlaceholder="Search by name or email..."
          onSearchChange={(v) => setFilter("search", v)}
          searchDebounceMs={400}
          pagination
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          showColumnToggle
          showTotal
          totalText="Total:"
          emptyMessage="No performance data found"
          onRefresh={handleRefresh}
          stickyHeader
          loading={isLoading}
          manualPagination
          totalItems={total}
          currentPage={page}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
        />
      )}

      <PerformanceDetailModal open={isViewOpen} onOpenChange={setIsViewOpen} instructor={viewing} />
    </div>
  );
}
