// components/shared/inputs/NumberInput.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseInputProps } from "@/types/types";
import { Button } from "@/components/ui/button";

export interface NumberInputProps extends BaseInputProps<number | undefined> {
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  showStepper?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
}

export function NumberInput({
  value,
  onChange,
  name,
  label,
  placeholder = "Enter number",
  disabled,
  readOnly,
  required,
  error,
  helperText,
  className,
  id,
  min,
  max,
  step = 1,
  precision,
  showStepper = false,
  formatOptions
}: NumberInputProps) {
  const inputId = id || name;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    if (val === "") {
      onChange(undefined);
      return;
    }

    const num = Number(val);
    if (!isNaN(num)) {
      // Apply precision if specified
      const finalValue = precision !== undefined 
        ? Number(num.toFixed(precision))
        : num;
      
      // Apply min/max constraints
      if (min !== undefined && finalValue < min) {
        onChange(min);
      } else if (max !== undefined && finalValue > max) {
        onChange(max);
      } else {
        onChange(finalValue);
      }
    }
  };

  const increment = () => {
    const currentValue = value ?? 0;
    const newValue = currentValue + step;
    
    if (max !== undefined && newValue > max) {
      onChange(max);
    } else {
      onChange(newValue);
    }
  };

  const decrement = () => {
    const currentValue = value ?? 0;
    const newValue = currentValue - step;
    
    if (min !== undefined && newValue < min) {
      onChange(min);
    } else {
      onChange(newValue);
    }
  };

  // Format display value
  const displayValue = (() => {
    if (value === undefined || value === null) return "";
    
    if (formatOptions) {
      return new Intl.NumberFormat(undefined, formatOptions).format(value);
    }
    
    if (precision !== undefined) {
      return value.toFixed(precision);
    }
    
    return value.toString();
  })();

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
        <Input
          id={inputId}
          name={name}
          type="number"
          value={value ?? ""}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          min={min}
          max={max}
          step={step}
          className={cn(
            showStepper && "pr-12",
            error && "border-red-500 focus-visible:ring-red-500"
          )}
          aria-invalid={!!error}
        />
        
        {showStepper && !disabled && !readOnly && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={increment}
              disabled={(max !== undefined && (value ?? 0) >= max)}
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-5 w-5 -mt-1"
              onClick={decrement}
              disabled={(min !== undefined && (value ?? 0) <= min)}
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
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