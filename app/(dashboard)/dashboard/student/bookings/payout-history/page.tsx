// app/dashboard/admin/drivers/payout-history/page.tsx
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
import { toast } from "sonner";

import { PayoutColumns } from "./columns";
import { payoutService } from "@/services/payout/payout.service";
import type { PayoutRow, PayoutKpis } from "@/types/payout.types";
import { payoutFilters } from "./_components/payout-filters.config";
import { PayoutKpiCards } from "./_components/PayoutKpiCards";
import { PayoutDetailModal } from "./_components/PayoutDetailModal";

export default function PayoutHistoryPage() {
  const [viewingRow, setViewingRow] = useState<PayoutRow | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [kpis, setKpis] = useState<PayoutKpis | null>(null);
  const [kpisLoading, setKpisLoading] = useState(true);

  const {
    values: filters,
    setFilter,
    setFilters,
    resetFilters,
    activeCount,
  } = useFilters(payoutFilters);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const apiParams = useMemo(
    () =>
      buildQueryParams(payoutFilters, filters, {
        extra: { page, limit: pageSize },
      }),
    [filters, page, pageSize]
  );

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const { data, isLoading, error, refresh } = useTableData<PayoutRow>(
    payoutService.getPayoutRows,
    apiParams
  );

  const loadKpis = useCallback(async () => {
    setKpisLoading(true);
    try {
      const res = await payoutService.getKpis();
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

  const handleView = useCallback((row: PayoutRow) => {
    setViewingRow(row);
    setIsViewOpen(true);
  }, []);

  const handleMarkPaid = useCallback(
    async (row: PayoutRow) => {
      try {
        await payoutService.markPaid(row.id);
        toast.success(`Marked ${row.reference} as paid`);
        refresh();
        loadKpis();
      } catch (e: any) {
        toast.error(e.message || "Failed to mark paid");
      }
    },
    [refresh, loadKpis]
  );

  const handleRetry = useCallback(
    async (row: PayoutRow) => {
      try {
        await payoutService.retry(row.id);
        toast.success(`Retrying ${row.reference}`);
        refresh();
        loadKpis();
      } catch (e: any) {
        toast.error(e.message || "Retry failed");
      }
    },
    [refresh, loadKpis]
  );

  const columns = useMemo(
    () => PayoutColumns(handleView, handleMarkPaid, handleRetry),
    [handleView, handleMarkPaid, handleRetry]
  );

  const rows = data?.data || [];
  const total = data?.total || rows.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payout History</h1>
          <p className="text-sm text-muted-foreground">
            Track what you&apos;ve paid out to instructors after commission.
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="icon" title="Refresh">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <PayoutKpiCards kpis={kpis} loading={kpisLoading} />

      <FilterBar
        configs={payoutFilters}
        values={filters}
        onFilterChange={setFilter}
        onReset={resetFilters}
        activeCount={activeCount}
        onApply={handleApplyFilters}
      />

      {isLoading && rows.length === 0 ? (
        <LoadingSpinner size="lg" text="Loading payout history..." />
      ) : error ? (
        <ErrorState error={error} onRetry={refresh} title="Failed to load payout history" />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          variant="default"
          density="normal"
          searchable
          searchPlaceholder="Search by name, email, or reference..."
          onSearchChange={(v) => setFilter("search", v)}
          searchDebounceMs={400}
          pagination
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          showColumnToggle
          showTotal
          totalText="Total:"
          emptyMessage="No payouts found"
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

      <PayoutDetailModal open={isViewOpen} onOpenChange={setIsViewOpen} row={viewingRow} />
    </div>
  );
}
