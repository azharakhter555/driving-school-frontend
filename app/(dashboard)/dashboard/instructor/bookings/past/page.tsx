/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable/DataTable-1";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { Plus, RefreshCw, Filter, ChevronDown } from "lucide-react";
import { DriverColumns } from "./columns";
import { AddInstructorModal } from "./_components/AddInstructorModal";
import { EditDriverModal } from "./_components/EditDriverModal";
import { useFilters, FilterBar } from "@/components/shared/filters";
// 👇 Uncomment these when you need Drawer / Modal filter views in another module
// import { FilterDrawer, FilterModal } from "@/components/shared/filters";
import { driverFilters } from "./_components/driver-filters.config";
import { buildQueryParams } from "@/lib/filter-utils";
import { useTableData } from "@/hooks/useTableData";
import { driverService } from "@/services/driver/driver.service";
import type { Instructor } from "@/types/instructor.types";
import { DriverViewModal } from "./_components/DriverViewModal";
// import { FilterBadge } from "@/components/shared/filters/FilterBadge";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
// 👇 Only needed for the filter-view dropdown (bar/drawer/modal)
// import { cn } from "@/lib/utils";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
//   DropdownMenuLabel,
// } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// 👇 Filter view type — kept for reference, only "bar" is used on this page
// type FilterView = "bar" | "drawer" | "modal";

export default function InstructorsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // ── Filter view state (bar / drawer / modal) ──
  // This page uses INLINE BAR ONLY.
  // Uncomment the block below when a module needs drawer/modal switching.
  // const [filterView, setFilterView] = useState<FilterView>("bar");
  // const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);

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
  } = useFilters(driverFilters);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const apiParams = useMemo(() => {
    return buildQueryParams(driverFilters, filters, {
      extra: { page, limit: pageSize },
    });
  }, [filters, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const { data, isLoading, error, refresh } = useTableData<Instructor>(
    driverService.getDrivers,
    apiParams
  );

  const handleRefresh = () => refresh();

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    refresh();
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEditingDriver(null);
    refresh();
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    // 👇 Uncomment when using drawer / modal views
    // setIsDrawerOpen(false);
    // setIsModalOpen(false);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  // ── CRUD Handlers ──
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

  // 2. Memoized columns — pass the THREE HANDLERS, not `columns`
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
  // ── Open filter in a specific view (drawer / modal) ──
  // Uncomment in modules that support drawer/modal filters.
  // const handleOpenFilter = (view: FilterView) => {
  //   setFilterView(view);
  //   if (view === "drawer") setIsDrawerOpen(true);
  //   else if (view === "modal") setIsModalOpen(true);
  // };

  const drivers = data?.data || [];
  const total = data?.total || data?.data?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instructors</h1>
          <p className="text-sm text-muted-foreground">Manage driving instructors</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* ─────────────────────────────────────────────────────────────
              FILTER VIEW DROPDOWN — only needed on modules that support
              Inline Bar / Drawer / Modal switching.
              This page uses INLINE BAR ONLY, so it's commented out.
              ─────────────────────────────────────────────────────────────
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={16} />
                Filters
                <FilterBadge count={actualActiveCount} />
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter View</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setFilterView("bar")}
                className={cn(filterView === "bar" && "bg-accent")}
              >
                Inline Bar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOpenFilter("drawer")}>
                Open in Drawer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOpenFilter("modal")}>
                Open in Modal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          */}

          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Instructor
          </Button>
        </div>
      </div>

      {/* Filter Bar — the only filter UI on this page */}
      <FilterBar
        configs={driverFilters}
        values={filters}
        onFilterChange={setFilter}
        onReset={resetFilters}
        activeCount={activeCount}
        onApply={handleApplyFilters}
      />

      {/* Data Table */}
      {/* Table area — loading/error handled ONLY here, so modals survive refetch */}
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
          onSearchChange={handleSearchChange} // 👈 server-side search
          searchDebounceMs={400}
          pagination
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          showColumnToggle
          showTotal
          totalText="Total:"
          emptyMessage="No instructors found"
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

      {/* ─────────────────────────────────────────────────────────────
          FILTER DRAWER — uncomment for modules that use drawer filters
          ─────────────────────────────────────────────────────────────
      <FilterDrawer
        configs={driverFilters}
        values={filters}
        onFilterChange={setFilter}
        onReset={resetFilters}
        activeCount={actualActiveCount}
        title="Filter Instructors"
        onApply={handleApplyFilters}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
      */}

      {/* ─────────────────────────────────────────────────────────────
          FILTER MODAL — uncomment for modules that use modal filters
          ─────────────────────────────────────────────────────────────
      <FilterModal
        configs={driverFilters}
        values={filters}
        onFilterChange={setFilter}
        onReset={resetFilters}
        activeCount={actualActiveCount}
        title="Filter Instructors"
        onApply={handleApplyFilters}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
      */}

      <AddInstructorModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={handleAddSuccess}
      />

      <EditDriverModal
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
