// components/shared/inputs/TimeInput.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseInputProps } from "@/types/types";

export interface TimeInputProps extends BaseInputProps<string> {
  format?: "12h" | "24h";
  step?: number; // minutes step
}

export function TimeInput({
  value = "",
  onChange,
  name,
  label,
  placeholder = "Select time",
  disabled,
  readOnly,
  required,
  error,
  helperText,
  className,
  id,
  format = "24h",
  step = 30
}: TimeInputProps) {
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
      
      <div className="relative">
        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={inputId}
          name={name}
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          step={step * 60} // Convert minutes to seconds
          className={cn(
            "pl-10",
            format === "12h" && "pr-12",
            error && "border-red-500 focus-visible:ring-red-500"
          )}
          aria-invalid={!!error}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
}