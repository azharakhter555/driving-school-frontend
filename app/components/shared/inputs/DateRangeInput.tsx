// components/shared/inputs/DateRangeInput.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { AlertCircle, Calendar as CalendarIcon } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import type { BaseInputProps, DateRange } from "@/types/types";

export interface DateRangeInputProps extends BaseInputProps<DateRange> {
  presets?: { label: string; range: DateRange }[];
  numberOfMonths?: number;
}

export function DateRangeInput({
  value = { from: undefined, to: undefined },
  onChange,
  name,
  label,
  placeholder = "Pick a date range",
  disabled,
  required,
  error,
  helperText,
  className,
  id,
  presets = [
    { label: "Today", range: { from: startOfDay(new Date()), to: endOfDay(new Date()) } },
    { label: "Yesterday", range: { from: startOfDay(subDays(new Date(), 1)), to: endOfDay(subDays(new Date(), 1)) } },
    { label: "Last 7 days", range: { from: startOfDay(subDays(new Date(), 7)), to: endOfDay(new Date()) } },
    { label: "Last 30 days", range: { from: startOfDay(subDays(new Date(), 30)), to: endOfDay(new Date()) } },
  ],
  numberOfMonths = 2
}: DateRangeInputProps) {
  const [open, setOpen] = useState(false);
  const inputId = id || name;

  const displayValue = value.from && value.to
    ? `${format(value.from, "LLL dd, y")} - ${format(value.to, "LLL dd, y")}`
    : value.from
    ? format(value.from, "LLL dd, y")
    : value.to
    ? format(value.to, "LLL dd, y")
    : placeholder;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label 
            htmlFor={inputId}
            className={cn(
              required && "after:content-['*'] after:ml-1 after:text-red-500"
            )}
          >
            {label}
          </Label>
          {helperText && (
            <span className="text-xs text-muted-foreground">{helperText}</span>
          )}
        </div>
      )}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={inputId}
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value.from && !value.to && "text-muted-foreground",
              error && "border-red-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayValue}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {presets.length > 0 && (
            <div className="p-2 border-b">
              <div className="flex flex-wrap gap-1">
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onChange(preset.range);
                      setOpen(false);
                    }}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <Calendar
            mode="range"
            selected={value}
            onSelect={(range) => {
              onChange(range as DateRange);
              if (range?.from && range?.to) {
                setOpen(false);
              }
            }}
            initialFocus
            numberOfMonths={numberOfMonths}
          />
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
}