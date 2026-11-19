/* eslint-disable @typescript-eslint/no-explicit-any */
// components/shared/filters/FilterBar.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FilterBadge } from "./FilterBadge";
import { FilterClearAll } from "./FilterClearAll";
import { Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterBarProps {
  configs: any[];
  values: Record<string, any>;
  onFilterChange: (id: string, value: any) => void;
  onReset: () => void;
  activeCount: number;
  title?: string;
  className?: string;
  onApply?: (values: any) => void;
}

const defaultForType = (type: string): unknown => {
  switch (type) {
    case "date-range":
      return { from: undefined, to: undefined };
    case "multi-select":
      return [];
    case "number":
    case "rating":
      return 0;
    default:
      return "";
  }
};

export function FilterBar({
  configs,
  values,
  onFilterChange,
  onReset,
  activeCount,
  title = "Filters",
  className,
  onApply,
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempValues, setTempValues] = useState<Record<string, any>>(values);

  const handleExpandToggle = () => {
    if (!isExpanded) {
      setTempValues(values);
    }
    setIsExpanded(!isExpanded);
  };

  const handleValueChange = (id: string, value: any) => {
    setTempValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleApply = () => {
    Object.entries(tempValues).forEach(([key, value]) => {
      onFilterChange(key, value);
    });

    if (onApply) {
      onApply(tempValues);
    }
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setTempValues(values); // discard pending edits only (correct semantics)
    setIsExpanded(false);
  };

  const handleReset = () => {
    const defaults: Record<string, any> = {};
    configs.forEach((c) => {
      defaults[c.id] = c.defaultValue ?? defaultForType(c.type);
    });
    setTempValues(defaults);
    onReset(); // 👈 push to parent → filters reset → count 0 → refetch
  };

  const handleClearAll = () => {
    const cleared: Record<string, any> = {};
    configs.forEach((c) => {
      if (c.type === "select" || c.type === "radio") cleared[c.id] = "all";
      else if (c.type === "number" || c.type === "rating") cleared[c.id] = 0;
      else if (c.type === "date-range") cleared[c.id] = { from: undefined, to: undefined };
      else cleared[c.id] = "";
    });
    setTempValues(cleared);
    onReset(); // 👈 same — parent reset, records refresh
  };
  const filterConfigs = configs.filter(
    (config) => config.type !== "text" && config.id !== "search"
  );

  const getActiveFilterCount = () => {
    return filterConfigs.filter((config) => {
      const value = tempValues[config.id];
      const defaultValue = config.defaultValue;

      if (config.type === "select" || config.type === "radio") {
        return value && value !== "all" && value !== defaultValue;
      }
      if (config.type === "number" || config.type === "rating") {
        return value > 0;
      }
      if (config.type === "date-range") {
        return value?.from || value?.to;
      }
      return false;
    }).length;
  };

  const tempActiveCount = getActiveFilterCount();

  const renderField = (config: any) => {
    const value = tempValues[config.id] ?? config.defaultValue;

    switch (config.type) {
      case "select":
      case "radio":
        return (
          <Select value={value} onValueChange={(val) => handleValueChange(config.id, val)}>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder={config.placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {config.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "number":
        return (
          <Input
            type="number"
            min={config.min}
            max={config.max}
            value={value}
            onChange={(e) => handleValueChange(config.id, Number(e.target.value))}
            placeholder={config.placeholder}
            className="h-9"
          />
        );

      case "rating":
        return (
          <div className="flex items-center gap-1 h-9">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleValueChange(config.id, star)}
                className={cn(
                  "text-xl transition-colors",
                  star <= value ? "text-yellow-500" : "text-muted"
                )}
              >
                ★
              </button>
            ))}
          </div>
        );

      case "date-range":
        return (
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={value?.from || ""}
              onChange={(e) =>
                handleValueChange(config.id, {
                  ...value,
                  from: e.target.value,
                })
              }
              className="h-9"
              placeholder="From"
            />
            <Input
              type="date"
              value={value?.to || ""}
              onChange={(e) =>
                handleValueChange(config.id, {
                  ...value,
                  to: e.target.value,
                })
              }
              className="h-9"
              placeholder="To"
            />
          </div>
        );

      default:
        return (
          <Input
            type="text"
            value={value || ""}
            onChange={(e) => handleValueChange(config.id, e.target.value)}
            placeholder={config.placeholder}
            className="h-9"
          />
        );
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Filter Bar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={isExpanded ? "default" : "outline"}
            size="sm"
            onClick={handleExpandToggle}
            className="gap-2"
          >
            <Filter size={16} />
            {title}
            <FilterBadge count={activeCount} />
            <ChevronDown
              size={14}
              className={cn("transition-transform", isExpanded && "rotate-180")}
            />
          </Button>

          {activeCount > 0 && !isExpanded && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>•</span>
              <span>
                {activeCount} active filter{activeCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {activeCount > 0 && !isExpanded && <FilterClearAll onClear={onReset} count={0} />}
      </div>

      {/* Expandable Filter Panel */}
      {isExpanded && (
        <div className="border rounded-lg bg-card p-4 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filterConfigs.map((config) => (
              <div
                key={config.id}
                className={cn(
                  "space-y-1.5",
                  config.width === "full" && "col-span-2 md:col-span-3 lg:col-span-4"
                )}
              >
                <Label className="text-xs font-medium text-muted-foreground">{config.label}</Label>
                {renderField(config)}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Reset to Default
              </Button>
              {tempActiveCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClearAll}>
                  Clear All
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleApply}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
