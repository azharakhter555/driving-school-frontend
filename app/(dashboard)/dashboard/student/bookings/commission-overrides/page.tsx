// app/dashboard/admin/drivers/commission/page.tsx
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

import { CommissionColumns } from "./columns";
import { commissionService } from "@/services/commission/commission.service";
import type { CommissionRow, CommissionKpis } from "@/types/commission.types";
import { commissionFilters } from "./_components/commission-filters.config";
import { CommissionKpiCards } from "./_components/CommissionKpiCards";
import { CommissionOverrideModal } from "./_components/CommissionOverrideModal";
import { CommissionDetailModal } from "./_components/CommissionDetailModal";

export default function CommissionOverridePage() {
  const [viewingRow, setViewingRow] = useState<CommissionRow | null>(null);
  const [editingRow, setEditingRow] = useState<CommissionRow | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);

  const [kpis, setKpis] = useState<CommissionKpis | null>(null);
  const [kpisLoading, setKpisLoading] = useState(true);

  const {
    values: filters,
    setFilter,
    setFilters,
    resetFilters,
    activeCount,
  } = useFilters(commissionFilters);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const apiParams = useMemo(
    () =>
      buildQueryParams(commissionFilters, filters, {
        extra: { page, limit: pageSize },
      }),
    [filters, page, pageSize]
  );

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const { data, isLoading, error, refresh } = useTableData<CommissionRow>(
    commissionService.getCommissionRows,
    apiParams
  );

  const loadKpis = useCallback(async () => {
    setKpisLoading(true);
    try {
      const res = await commissionService.getKpis();
      setKpis(res.data);
    } catch {
      /* silent */
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

  const handleView = useCallback((row: CommissionRow) => {
    setViewingRow(row);
    setIsViewOpen(true);
  }, []);

  const handleOverride = useCallback((row: CommissionRow) => {
    setEditingRow(row);
    setIsOverrideOpen(true);
  }, []);

  const columns = useMemo(
    () => CommissionColumns(handleView, handleOverride),
    [handleView, handleOverride]
  );

  const handleOverrideSuccess = () => {
    setIsOverrideOpen(false);
    setEditingRow(null);
    refresh();
    loadKpis();
  };

  const rows = data?.data || [];
  const total = data?.total || rows.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commission Overrides</h1>
          <p className="text-sm text-muted-foreground">
            Set custom commission rates per instructor. Default platform rate is{" "}
            <span className="font-medium text-foreground">{kpis?.defaultRate ?? 15}%</span>.
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="icon" title="Refresh">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <CommissionKpiCards kpis={kpis} loading={kpisLoading} />

      <FilterBar
        configs={commissionFilters}
        values={filters}
        onFilterChange={setFilter}
        onReset={resetFilters}
        activeCount={activeCount}
        onApply={handleApplyFilters}
      />

      {isLoading && rows.length === 0 ? (
        <LoadingSpinner size="lg" text="Loading commission data..." />
      ) : error ? (
        <ErrorState error={error} onRetry={refresh} title="Failed to load commission data" />
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
          emptyMessage="No commission data found"
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

      <CommissionDetailModal open={isViewOpen} onOpenChange={setIsViewOpen} row={viewingRow} />

      <CommissionOverrideModal
        open={isOverrideOpen}
        onOpenChange={setIsOverrideOpen}
        row={editingRow}
        onSuccess={handleOverrideSuccess}
      />
    </div>
  );
}
