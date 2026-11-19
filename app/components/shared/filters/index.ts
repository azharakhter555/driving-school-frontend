/* eslint-disable @typescript-eslint/no-explicit-any */
// components/shared/filters/index.ts

// Export types
export type { FilterConfig, FilterState } from "@/types/filter";

// Export the standalone hook (NOT the context one)
export { useFilters } from "@/hooks/useFilters"; // ✅ Use this one

// Core components
export { FilterRenderer } from "./FilterRenderer";
export { FilterGroup } from "./FilterGroup";

// Utility components
export { FilterBadge } from "./FilterBadge";
export { FilterPresets } from "./FilterPresets";
export { FilterSearch } from "./FilterSearch";
export { FilterClearAll } from "./FilterClearAll";

// Layout components
export { FilterSidebar } from "./FilterSidebar";
export { FilterDrawer } from "./FilterDrawer";
export { FilterModal } from "./FilterModal";

export { FilterBar, type FilterBarProps } from "./FilterBar";
