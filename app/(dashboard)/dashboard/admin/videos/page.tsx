/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/admin/videos/page.tsx

"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { Plus, RefreshCw, Filter, ChevronDown } from "lucide-react";
import { useVideos } from "@/hooks/useVideos";
import { videoFilters } from "./_components/VideoFilters";
import { VideoCard } from "./_components/VideoCard";
import { VideoListItem } from "./_components/VideoListItem";
import { VideoViewToggle } from "./_components/VideoViewToggle";
import { AddVideoModal } from "./_components/AddVideoModal";
import { useFilters } from "@/components/shared/filters";
import {
  FilterBar,
  FilterDrawer,
  FilterModal,
} from "@/components/shared/filters";
import { FilterBadge } from "@/components/shared/filters/FilterBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Video } from "@/types/video.types"; // ✅ Import Video type

type FilterView = "bar" | "drawer" | "modal";
type VideoView = "grid" | "list";

export default function VideosPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterView, setFilterView] = useState<FilterView>("bar");
  const [videoView, setVideoView] = useState<VideoView>("grid");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Filters
  const { values: filters, setFilter, setFilters, resetFilters } = useFilters(videoFilters);

  // Active filter count
  const actualActiveCount = useMemo(() => {
    return videoFilters.filter((filter) => {
      const value = filters[filter.id];
      const defaultValue = filter.defaultValue;

      if (filter.id === "search") return false;
      if (filter.type === "select" || filter.type === "radio") {
        return value && value !== "all" && value !== defaultValue;
      }
      if (filter.type === "number") {
        return value > 0;
      }
      return false;
    }).length;
  }, [filters]);

  // API Params
  const apiParams = useMemo(() => {
    const params: any = { page, limit: pageSize };

    if (filters["search"]) params.search = filters["search"];
    if (filters["status"] && filters["status"] !== "all") params.status = filters["status"];
    if (filters["category"] && filters["category"] !== "all") params.category = filters["category"];
    if (filters["minDuration"] > 0) params.minDuration = filters["minDuration"];
    if (filters["maxDuration"] > 0) params.maxDuration = filters["maxDuration"];
    if (filters["sortBy"]) params.sortBy = filters["sortBy"];

    return params;
  }, [filters, page, pageSize]);

  const { data, isLoading, error, refresh } = useVideos(apiParams);

  // Reset page when filters change
  const [prevFilters, setPrevFilters] = useState(filters);
  if (prevFilters !== filters) {
    setPrevFilters(filters);
    setPage(1);
  }

  const videos = data?.data || [];
  const total = data?.total || 0;

  const handleRefresh = () => refresh();
  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    refresh();
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setIsDrawerOpen(false);
    setIsModalOpen(false);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  // ✅ Add proper type for video parameter
  const handleView = (video: Video) => {
    console.log("View:", video);
  };
  
  const handleEdit = (video: Video) => {
    console.log("Edit:", video);
  };
  
  const handleDelete = (video: Video) => {
    if (confirm(`Delete "${video.title}"?`)) {
      console.log("Delete:", video.id);
    }
  };

  const handleOpenFilter = (view: FilterView) => {
    setFilterView(view);
    if (view === "drawer") setIsDrawerOpen(true);
    if (view === "modal") setIsModalOpen(true);
  };

  if (isLoading) return <LoadingSpinner fullPage size="lg" text="Loading videos..." />;

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={refresh}
        title="Failed to load videos"
        fullPage
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Video Library</h1>
          <p className="text-sm text-muted-foreground">
            Manage and organize your driving instruction videos
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <VideoViewToggle view={videoView} onViewChange={setVideoView} />

          {/* Refresh */}
          <Button onClick={handleRefresh} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* Filter Dropdown */}
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

          {/* Add Button */}
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Video
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      {filterView === "bar" && (
        <FilterBar
          configs={videoFilters}
          values={filters}
          onFilterChange={setFilter}
          onReset={resetFilters}
          activeCount={actualActiveCount}
          onApply={handleApplyFilters}
        />
      )}

      {/* Stats Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{videos.length}</span> of{" "}
          <span className="font-medium text-foreground">{total}</span> videos
        </p>
      </div>

      {/* Videos Grid/List View */}
      {videos.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No videos found</p>
          <Button
            variant="link"
            onClick={() => setIsAddModalOpen(true)}
            className="mt-2"
          >
            Upload your first video
          </Button>
        </div>
      ) : videoView === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video:any ) => (
            <VideoCard
              key={video.id}
              video={video}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {videos.map((video:any ) => (
            <VideoListItem
              key={video.id}
              video={video}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {page} of {Math.ceil(total / pageSize)}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= Math.ceil(total / pageSize)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Filter Drawer */}
      <FilterDrawer
        configs={videoFilters}
        values={filters}
        onFilterChange={setFilter}
        onReset={resetFilters}
        activeCount={actualActiveCount}
        title="Filter Videos"
        onApply={handleApplyFilters}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />

      {/* Filter Modal */}
      <FilterModal
        configs={videoFilters}
        values={filters}
        onFilterChange={setFilter}
        onReset={resetFilters}
        activeCount={actualActiveCount}
        title="Filter Videos"
        onApply={handleApplyFilters}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      {/* Add Video Modal */}
      <AddVideoModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}