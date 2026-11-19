// components/shared/inputs/DateTimeInput.tsx
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
import { Input } from "@/components/ui/input";
import { AlertCircle, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import type { BaseInputProps } from "@/types/types";

export interface DateTimeInputProps extends BaseInputProps<Date | undefined> {
  showTime?: boolean;
  dateFormat?: string;
  timeFormat?: "12h" | "24h";
}

export function DateTimeInput({
  value,
  onChange,
  name,
  label,
  placeholder = "Pick date & time",
  disabled,
  required,
  error,
  helperText,
  className,
  id,
  showTime = true,
  dateFormat = "PPP",
  timeFormat = "24h"
}: DateTimeInputProps) {
  const [open, setOpen] = useState(false);
  const [timeValue, setTimeValue] = useState<string>(() => {
    if (value && isValid(value)) {
      try {
        return format(value, timeFormat === "24h" ? "HH:mm" : "hh:mm a");
      } catch {
        return "";
      }
    }
    return "";
  });
  
  const inputId = id || name;

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isValid(date)) {
      if (timeValue && timeValue.trim() !== "") {
        // Parse time and combine with date
        const parsedTime = parseTime(timeValue, timeFormat);
        if (parsedTime) {
          const [hours, minutes] = parsedTime;
          const newDate = new Date(date);
          newDate.setHours(hours, minutes);
          onChange(newDate);
          return;
        }
      }
      onChange(date);
    } else {
      onChange(undefined);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeValue(newTime);
    
    if (value && isValid(value) && newTime && newTime.trim() !== "") {
      const parsedTime = parseTime(newTime, timeFormat);
      if (parsedTime) {
        const [hours, minutes] = parsedTime;
        const newDate = new Date(value);
        newDate.setHours(hours, minutes);
        onChange(newDate);
      }
    }
  };

  const parseTime = (time: string, format: "12h" | "24h"): [number, number] | null => {
    // Guard clause for undefined or empty time
    if (!time || typeof time !== 'string' || time.trim() === '') {
      return null;
    }

    const trimmedTime = time.trim();

    if (format === "12h") {
      // Try to parse 12-hour format (e.g., "02:30 PM" or "2:30 PM")
      const match = trimmedTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (match) {
        // Safely extract values with null checks
        const hoursStr = match[1];
        const minutesStr = match[2];
        const ampm = match[3];
        
        if (hoursStr && minutesStr && ampm) {
          const hours = parseInt(hoursStr, 10);
          const minutes = parseInt(minutesStr, 10);
          
          if (!isNaN(hours) && !isNaN(minutes)) {
            const ampmUpper = ampm.toUpperCase();
            
            if (ampmUpper === "PM" && hours < 12) {
              return [hours + 12, minutes];
            }
            if (ampmUpper === "AM" && hours === 12) {
              return [0, minutes];
            }
            return [hours, minutes];
          }
        }
      }
    } else {
      // Try to parse 24-hour format (e.g., "14:30" or "14:30:00")
      if (trimmedTime.includes(':')) {
        const parts = trimmedTime.split(':');
        // Safely check if we have at least 2 parts
        if (parts.length >= 2) {
          const hoursStr = parts[0];
          const minutesStr = parts[1];
          
          if (hoursStr && minutesStr) {
            const hours = parseInt(hoursStr, 10);
            const minutes = parseInt(minutesStr, 10);
            
            if (!isNaN(hours) && !isNaN(minutes)) {
              // Validate hours and minutes range
              if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
                return [hours, minutes];
              }
            }
          }
        }
      }
    }
    
    return null;
  };

  const getDisplayValue = (): string => {
    if (!value || !isValid(value)) {
      return placeholder;
    }
    
    try {
      if (showTime) {
        const timeFormatString = timeFormat === "24h" ? "HH:mm" : "hh:mm a";
        return format(value, `${dateFormat} ${timeFormatString}`);
      }
      return format(value, dateFormat);
    } catch {
      return placeholder;
    }
  };

  const displayValue = getDisplayValue();

  // Validate if the current time value is valid
  const isTimeValid = (): boolean => {
    if (!timeValue || timeValue.trim() === '') return true;
    return parseTime(timeValue, timeFormat) !== null;
  };

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
              (error || !isTimeValid()) && "border-red-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayValue}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value && isValid(value) ? value : undefined}
            onSelect={handleDateSelect}
            initialFocus
            disabled={disabled}
          />
          {showTime && (
            <div className="p-3 border-t">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  type={timeFormat === "24h" ? "time" : "text"}
                  value={timeValue}
                  onChange={handleTimeChange}
                  placeholder={timeFormat === "24h" ? "HH:MM" : "HH:MM AM/PM"}
                  step={60}
                  className={cn(
                    "flex-1",
                    !isTimeValid() && timeValue && "border-red-500"
                  )}
                  disabled={disabled}
                />
              </div>
              {!isTimeValid() && timeValue && timeValue.trim() !== '' && (
                <p className="text-xs text-red-500 mt-1">
                  Invalid time format. Use {timeFormat === "24h" ? "HH:MM" : "HH:MM AM/PM"}
                </p>
              )}
            </div>
          )}
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