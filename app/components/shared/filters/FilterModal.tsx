/* eslint-disable @typescript-eslint/no-explicit-any */
// components/shared/filters/FilterModal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterModalProps {
  configs: any[];
  values: Record<string, any>;
  onFilterChange: (id: string, value: any) => void;
  onReset: () => void;
  activeCount: number;
  title?: string;
  trigger?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  onApply?: (values: any) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function FilterModal({
  configs,
  values,
  onFilterChange,
  onReset,
  activeCount,
  title = "Filters",
  trigger,
  size = "lg",
  className,
  onApply,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: FilterModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [tempValues, setTempValues] = useState<Record<string, any>>(values);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setTempValues(values);
    }
    setOpen(isOpen);
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
    setOpen(false);
  };

  const handleReset = () => {
    const defaultValues: Record<string, any> = {};
    configs.forEach((config) => {
      if (config.defaultValue !== undefined) {
        defaultValues[config.id] = config.defaultValue;
      }
    });
    setTempValues(defaultValues);
  };

  const handleClearAll = () => {
    const clearedValues: Record<string, any> = {};
    configs.forEach((config) => {
      if (config.type === "select" || config.type === "radio") {
        clearedValues[config.id] = "all";
      } else if (config.type === "number" || config.type === "rating") {
        clearedValues[config.id] = 0;
      } else if (config.type === "date-range") {
        clearedValues[config.id] = { from: "", to: "" };
      } else {
        clearedValues[config.id] = "";
      }
    });
    setTempValues(clearedValues);
  };

  const modalConfigs = configs.filter(
    (config) => config.type !== "text" && config.id !== "search"
  );

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Filter size={16} />
      Filters
      <FilterBadge count={activeCount} />
    </Button>
  );

  const getActiveFilterCount = () => {
    return modalConfigs.filter((config) => {
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

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full"
  };

  const renderField = (config: any) => {
    const value = tempValues[config.id] ?? config.defaultValue;

    switch (config.type) {
      case "select":
      case "radio":
        return (
          <Select
            value={value}
            onValueChange={(val) => handleValueChange(config.id, val)}
          >
            <SelectTrigger className="w-full">
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
          />
        );
      
      case "rating":
        return (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleValueChange(config.id, star)}
                className={cn(
                  "text-2xl transition-colors",
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
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">From</Label>
              <Input
                type="date"
                value={value?.from || ""}
                onChange={(e) => handleValueChange(config.id, { 
                  ...value, 
                  from: e.target.value 
                })}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">To</Label>
              <Input
                type="date"
                value={value?.to || ""}
                onChange={(e) => handleValueChange(config.id, { 
                  ...value, 
                  to: e.target.value 
                })}
                className="w-full"
              />
            </div>
          </div>
        );
      
      default:
        return (
          <Input
            type="text"
            value={value || ""}
            onChange={(e) => handleValueChange(config.id, e.target.value)}
            placeholder={config.placeholder}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {controlledOpen === undefined && (
        <DialogTrigger asChild>
          {trigger || defaultTrigger}
        </DialogTrigger>
      )}
      <DialogContent className={cn(sizeClasses[size], className)}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          {/* <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X size={18} />
            </Button>
          </DialogClose> */}
        </DialogHeader>``

        <div className="py-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            {modalConfigs.map((config) => (
              <div 
                key={config.id} 
                className={cn(
                  "space-y-1.5",
                  config.width === "full" && "col-span-2"
                )}
              >
                <Label className="text-sm font-medium text-muted-foreground">
                  {config.label}
                </Label>
                {renderField(config)}
                {config.description && (
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReset}
                className="h-9"
              >
                Reset
              </Button>
              {tempActiveCount > 0 && (
                <FilterClearAll onClear={handleClearAll} count={0} />
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApply} className="h-9 px-6">
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}