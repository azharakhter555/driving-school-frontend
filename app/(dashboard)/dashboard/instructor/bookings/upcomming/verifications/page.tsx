// app/dashboard/admin/instructors/pending/page.tsx (your path)
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable/DataTable-1";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { RefreshCw } from "lucide-react";
import { DriverColumns } from "../columns";
import { EditDriverModalApprove } from "../_components/EditDriverModalApprove";
import { useFilters, FilterBar } from "@/components/shared/filters";
import { driverFilters } from "../_components/driver-filters.config";
import { buildQueryParams } from "@/lib/filter-utils";
import { useTableData } from "@/hooks/useTableData";
import { driverService } from "@/services/driver/driver.service";
import type { Instructor } from "@/types/instructor.types";
import { DriverViewModal } from "../_components/DriverViewModal";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { toast } from "sonner";

export default function PendingInstructorsPage() {
  // ── 1. Page-specific filter set (no approvalStatus — it's forced) ──
  const pageFilters = useMemo(() => driverFilters.filter((f) => f.id !== "approvalStatus"), []);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Instructor | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingInstructor, setViewingInstructor] = useState<Instructor | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingInstructor, setDeletingInstructor] = useState<Instructor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    values: filters,
    setFilter,
    setFilters,
    resetFilters,
    activeCount,
  } = useFilters(pageFilters);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ── 2. Force approvalStatus=pending in every request ──
  const apiParams = useMemo(() => {
    return buildQueryParams(pageFilters, filters, {
      extra: {
        page,
        limit: pageSize,
        // v6 nestjs-paginate: filter.<key>=<value>
        // If you upgrade to v7, change this key to "approvalStatus".
        "filter.approvalStatus": "pending",
      },
    });
  }, [filters, page, pageSize, pageFilters]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const { data, isLoading, error, refresh } = useTableData<Instructor>(
    driverService.getDrivers,
    apiParams
  );

  const handleRefresh = () => refresh();

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEditingDriver(null);
    refresh();
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleView = useCallback((instructor: Instructor) => {
    setViewingInstructor(instructor);
    setIsViewModalOpen(true);
  }, []);

  const handleEdit = useCallback((instructor: Instructor) => {
    setEditingDriver(instructor);
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((instructor: Instructor) => {
    setDeletingInstructor(instructor);
    setDeleteDialogOpen(true);
  }, []);

  const columns = useMemo(
    () => DriverColumns(handleView, handleEdit, handleDeleteClick),
    [handleView, handleEdit, handleDeleteClick]
  );

  const handleConfirmDelete = async () => {
    if (!deletingInstructor) return;
    setIsDeleting(true);
    try {
      await driverService.deleteDriver(deletingInstructor.id);
      toast.success("Instructor deleted successfully");
      refresh();
      setDeleteDialogOpen(false);
      setDeletingInstructor(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete instructor");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setFilter("search", value);
  };

  const drivers = data?.data || [];
  const total = data?.total || data?.data?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Verification Of Instructors</h1>
          <p className="text-sm text-muted-foreground">
            Only instructors with pending approval Not Verified status are shown here.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <FilterBar
        configs={pageFilters}
        values={filters}
        onFilterChange={setFilter}
        onReset={resetFilters}
        activeCount={activeCount}
        onApply={handleApplyFilters}
      />

      {isLoading && drivers.length === 0 ? (
        <LoadingSpinner size="lg" text="Loading instructors..." />
      ) : error ? (
        <ErrorState error={error} onRetry={refresh} title="Failed to load instructors" />
      ) : (
        <DataTable
          columns={columns}
          data={drivers}
          variant="default"
          density="normal"
          searchable
          searchPlaceholder="Search by name or email..."
          onSearchChange={handleSearchChange}
          searchDebounceMs={400}
          pagination
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          showColumnToggle
          showTotal
          totalText="Total:"
          emptyMessage="No pending instructors found"
          onRefresh={handleRefresh}
          stickyHeader
          loading={isLoading}
          manualPagination
          totalItems={total}
          currentPage={page}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      <EditDriverModalApprove
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        driver={editingDriver}
        onSuccess={handleEditSuccess}
      />

      <DriverViewModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        instructor={viewingInstructor}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Instructor"
        description={`Are you sure you want to delete ${deletingInstructor?.firstName} ${deletingInstructor?.lastName}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
}
