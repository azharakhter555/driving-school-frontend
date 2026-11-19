// components/shared/inputs/DateInput.tsx
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
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { BaseInputProps } from "@/types/types";

export interface DateInputProps extends BaseInputProps<Date | undefined> {
  presets?: { label: string; value: Date }[];
  fromYear?: number;
  toYear?: number;
}

export function DateInput({
  value,
  onChange,
  name,
  label,
  placeholder = "Pick a date",
  disabled,
  required,
  error,
  helperText,
  className,
  id,
  presets = [
    { label: "Today", value: new Date() },
    { label: "Tomorrow", value: new Date(Date.now() + 86400000) },
    { label: "Next week", value: new Date(Date.now() + 604800000) },
  ],
  fromYear = 1900,
  toYear = 2100
}: DateInputProps) {
  const [open, setOpen] = useState(false);
  const inputId = id || name;

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
              !value && "text-muted-foreground",
              error && "border-red-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : placeholder}
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
                      onChange(preset.value);
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
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            initialFocus
            fromYear={fromYear}
            toYear={toYear}
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