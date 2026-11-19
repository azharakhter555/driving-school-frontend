/* eslint-disable @typescript-eslint/no-explicit-any */
// components/shared/filters/FilterSidebar.tsx
"use client";

import { useState } from "react";
import { FilterGroup } from "./FilterGroup";
import { FilterBadge } from "./FilterBadge";
import { FilterClearAll } from "./FilterClearAll";
import { FilterPresets } from "./FilterPresets";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterSidebarProps {
  configs: any[];
  values: Record<string, any>;           // 👈 Add these
  onFilterChange: (id: string, value: any) => void;
  onReset: () => void;
  onLoadPreset?: (values: any) => void;
  activeCount: number;
  title?: string;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  width?: number;
  collapsedWidth?: number;
  children?: React.ReactNode;
}

export function FilterSidebar({
  configs,
  values,
  onFilterChange,
  onReset,
  onLoadPreset,
  activeCount,
  title = "Filters",
  className,
  collapsible = true,
  defaultCollapsed = false,
  width = 280,
  collapsedWidth = 60,
  children
}: FilterSidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div
      className={cn(
        "relative h-full border-r bg-background transition-all duration-300",
        className
      )}
      style={{ width: collapsed ? collapsedWidth : width }}
    >
      {collapsible && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-6 h-6 w-6 rounded-full border bg-background"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>
      )}

      {collapsed ? (
        <div className="flex flex-col items-center py-4 space-y-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <FilterBadge count={activeCount} variant="outline" showLabel={false} />
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{title}</h3>
              <div className="flex items-center gap-1">
                <FilterBadge count={activeCount} />
                <FilterClearAll onClear={onReset} count={activeCount} />
              </div>
            </div>
            {onLoadPreset && (
              <FilterPresets 
                values={values} 
                onLoad={onLoadPreset} 
              />
            )}
          </div>

          {/* Filter content */}
          <ScrollArea className="flex-1 p-4">
            <FilterGroup
            title={undefined }
              configs={configs}
              values={values}
              onFilterChange={onFilterChange}
              onReset={onReset}
              layout="vertical"
              bordered={false}
              showApply={false}
              showReset={false}
              showClear={false}
            />
          </ScrollArea>

          {/* Footer with custom content */}
          {children && (
            <>
              <Separator />
              <div className="p-4">{children}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}