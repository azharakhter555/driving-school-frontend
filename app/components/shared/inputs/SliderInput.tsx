// components/shared/inputs/SliderInput.tsx
"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseInputProps } from "@/types/types";

export interface SliderInputProps extends BaseInputProps<number[]> {
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

export function SliderInput({
  value = [0],
  onChange,
  name,
  label,
  disabled,
  required,
  error,
  helperText,
  className,
  id,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  formatValue = (v) => v.toString()
}: SliderInputProps) {
  const inputId = id || name;

  const handleChange = (newValue: number[]) => {
    onChange(newValue);
  };

  // Safely get the current value with proper type checking
  const getCurrentValue = (): number => {
    if (value && Array.isArray(value) && value.length > 0 && typeof value[0] === 'number') {
      return value[0];
    }
    return 0;
  };

  const currentValue = getCurrentValue();

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
      
      <div className="flex items-center gap-4">
        <Slider
          id={inputId}
          value={value || [0]}
          onValueChange={handleChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={cn("flex-1", error && "border-red-500")}
          aria-invalid={!!error}
        />
        {showValue && (
          <span className="text-sm font-medium min-w-[3rem]">
            {formatValue(currentValue)}
          </span>
        )}
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