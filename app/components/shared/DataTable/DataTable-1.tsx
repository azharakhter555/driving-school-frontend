// components/shared/DataTable/index.tsx
"use client";

import { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { SortingState, ColumnFiltersState, PaginationState } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { variantStyles, densityStyles } from "@/config";
import type { DataTableProps } from "@/config";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  RefreshCw,
  Maximize2,
  Minimize2,
  Columns,
  FileJson,
  FileSpreadsheet,
  Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  description,
  searchable = true,
  searchPlaceholder = "Search...",
  filterable = false,
  filters,
  pagination = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  onExport,
  onExportCSV,
  onExportExcel,
  onPrint,
  onRefresh,
  variant = "modern",
  className,
  density = "normal",
  stickyHeader = true,
  showColumnToggle = true,
  showTotal = true,
  totalText = "Total records:",
  emptyMessage = "No results found.",
  loading = false,
  // ✅ Server-side pagination props
  manualPagination = false,
  totalItems,
  currentPage: externalCurrentPage = 1,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  searchDebounceMs = 300,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [fullscreen, setFullscreen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const isServerSearch = typeof onSearchChange === "function";

  useEffect(() => {
    if (isServerSearch) return;
    setGlobalFilter(searchInput);
  }, [searchInput, isServerSearch]);

  useEffect(() => {
    if (!isServerSearch) return;
    const timer = setTimeout(() => {
      onSearchChange?.(searchInput);
    }, searchDebounceMs);
    return () => clearTimeout(timer);
  }, [searchInput, isServerSearch, searchDebounceMs, onSearchChange]);
  // ✅ Internal pagination state (for client-side)
  const [internalPagination, setInternalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  // ✅ Sync external page changes
  useEffect(() => {
    if (manualPagination && externalCurrentPage) {
      setInternalPagination((prev) => ({
        ...prev,
        pageIndex: externalCurrentPage - 1,
      }));
    }
  }, [manualPagination, externalCurrentPage]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination && !manualPagination ? getPaginationRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    // ✅ Manual pagination configuration
    manualPagination,
    pageCount:
      manualPagination && totalItems
        ? Math.ceil(totalItems / internalPagination.pageSize)
        : undefined,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      pagination: internalPagination,
    },
    onPaginationChange: setInternalPagination,
  });

  // ✅ Handle page change
  const handlePageChange = (newPage: number) => {
    if (manualPagination && onPageChange) {
      onPageChange(newPage);
    } else {
      table.setPageIndex(newPage - 1);
    }
  };

  // ✅ Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    if (manualPagination && onPageSizeChange) {
      onPageSizeChange(newSize);
    } else {
      table.setPageSize(newSize);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchInput("");
    setGlobalFilter("");
    setColumnFilters([]);
    table.resetSorting();
  };

  // Check if any filters are active
  const hasActiveFilters =
    (isServerSearch ? searchInput : globalFilter) || columnFilters.length > 0 || sorting.length > 0;
  // ✅ Calculate display values
  const currentPageIndex = manualPagination
    ? externalCurrentPage
    : table.getState().pagination.pageIndex + 1;

  const totalPageCount =
    manualPagination && totalItems
      ? Math.ceil(totalItems / internalPagination.pageSize)
      : table.getPageCount();

  const canPreviousPage = manualPagination ? externalCurrentPage > 1 : table.getCanPreviousPage();

  const canNextPage = manualPagination
    ? externalCurrentPage < totalPageCount
    : table.getCanNextPage();

  const displayTotal = manualPagination ? totalItems : data.length;
  // const showingCount = manualPagination ? data.length : table.getRowModel().rows.length;

  return (
    <div
      className={cn(
        "space-y-4",
        fullscreen && "fixed inset-4 z-50 bg-background flex flex-col",
        className
      )}
    >
      {/* Header with Title and Actions */}
      {(title ||
        description ||
        onRefresh ||
        onExport ||
        onExportCSV ||
        onExportExcel ||
        onPrint) && (
        <div className="flex items-center justify-between">
          <div>
            {title && <h2 className="text-xl font-semibold tracking-tight">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button variant="outline" size="icon" onClick={onRefresh} title="Refresh">
                <RefreshCw size={16} />
              </Button>
            )}

            {(onExport || onExportCSV || onExportExcel || onPrint) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {onExportCSV && (
                    <DropdownMenuItem onClick={onExportCSV}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Export as CSV
                    </DropdownMenuItem>
                  )}
                  {onExportExcel && (
                    <DropdownMenuItem onClick={onExportExcel}>
                      <FileJson className="mr-2 h-4 w-4" />
                      Export as Excel
                    </DropdownMenuItem>
                  )}
                  {onPrint && (
                    <DropdownMenuItem onClick={onPrint}>
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </DropdownMenuItem>
                  )}
                  {onExport && (
                    <DropdownMenuItem onClick={onExport}>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button variant="outline" size="icon" onClick={toggleFullscreen}>
              {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </Button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-8 pr-8"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )}
          {filterable && (
            <Button
              variant={showFilters ? "default" : "outline"}
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(showFilters && "bg-primary text-primary-foreground")}
            >
              <Filter size={16} />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {showColumnToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  <Columns size={16} className="mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {hasActiveFilters && (
            <Badge variant="secondary" className="gap-1 px-2">
              <span>Filters active</span>
              <button onClick={clearFilters} className="ml-1 hover:text-foreground">
                <X size={12} />
              </button>
            </Badge>
          )}
        </div>
      </div>

      {/* Filters panel */}
      {filterable && showFilters && (
        <div className="p-4 border rounded-lg bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Filters</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
              <X size={14} className="mr-1" />
              Close
            </Button>
          </div>
          {filters ? (
            filters
          ) : (
            <div className="text-sm text-muted-foreground">No filters available</div>
          )}
        </div>
      )}

      {/* Table */}
      <div
        className={cn(
          "relative w-full overflow-hidden",
          variantStyles[variant],
          fullscreen && "flex-1"
        )}
      >
        {loading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex items-center gap-2">
              <RefreshCw size={20} className="animate-spin" />
              <span>Loading...</span>
            </div>
          </div>
        )}

        <div className="w-full overflow-auto max-h-[calc(100vh-220px)]">
          <Table className={cn(densityStyles[density].table, "min-w-max")}>
            <TableHeader className={cn(stickyHeader && "sticky top-0 bg-background z-10")}>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(densityStyles[density].header, "whitespace-nowrap")}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            "flex items-center gap-2",
                            header.column.getCanSort() && "cursor-pointer select-none"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <span className="ml-1">
                              {header.column.getIsSorted() === "asc" ? (
                                <ArrowUp size={14} className="text-primary" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ArrowDown size={14} className="text-primary" />
                              ) : (
                                <ArrowUpDown
                                  size={14}
                                  className="text-muted-foreground opacity-50"
                                />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      variant === "striped" && "even:bg-muted/50",
                      "hover:bg-muted/50 transition-colors"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(densityStyles[density].cell, "whitespace-nowrap")}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className={cn("h-32 text-center", densityStyles[density].cell)}
                  >
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Search size={32} className="mb-2 opacity-50" />
                      <p>{emptyMessage}</p>
                      {hasActiveFilters && (
                        <Button variant="link" onClick={clearFilters} className="mt-2">
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {showTotal && (
            <div className="text-sm text-muted-foreground order-2 sm:order-1">
              {totalText} {displayTotal}
              {/* {showingCount < displayTotal && (
                <span className="ml-1">(showing {showingCount})</span>
              )} */}
            </div>
          )}

          <div className="flex items-center gap-4 order-1 sm:order-2">
            <Select
              value={internalPagination.pageSize.toString()}
              onValueChange={(value) => handlePageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <p className="text-sm text-muted-foreground whitespace-nowrap">
              Page {currentPageIndex} of {totalPageCount}
            </p>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={!canPreviousPage}
                className="h-8 w-8"
              >
                <ChevronsLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPageIndex - 1)}
                disabled={!canPreviousPage}
                className="h-8 w-8"
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPageIndex + 1)}
                disabled={!canNextPage}
                className="h-8 w-8"
              >
                <ChevronRight size={16} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPageCount)}
                disabled={!canNextPage}
                className="h-8 w-8"
              >
                <ChevronsRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
