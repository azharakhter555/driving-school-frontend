// components/shared/inputs/NumberRangeInput.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseInputProps, NumberRange } from "@/types/types";

export interface NumberRangeInputProps extends BaseInputProps<NumberRange> {
  min?: number;
  max?: number;
  step?: number;
  allowNegative?: boolean;
}

export function NumberRangeInput({
  value = { min: undefined, max: undefined },
  onChange,
  name,
  label,
  placeholder,
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
  allowNegative = true
}: NumberRangeInputProps) {
  const inputId = id || name;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = e.target.value ? Number(e.target.value) : undefined;
    onChange({ ...value, min: newMin });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = e.target.value ? Number(e.target.value) : undefined;
    onChange({ ...value, max: newMax });
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
      
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            type="number"
            placeholder="Min"
            value={value.min ?? ""}
            onChange={handleMinChange}
            disabled={disabled}
            readOnly={readOnly}
            min={min}
            max={value.max}
            step={step}
            className={cn(error && "border-red-500")}
          />
        </div>
        <span className="text-muted-foreground">-</span>
        <div className="flex-1">
          <Input
            type="number"
            placeholder="Max"
            value={value.max ?? ""}
            onChange={handleMaxChange}
            disabled={disabled}
            readOnly={readOnly}
            min={value.min}
            max={max}
            step={step}
            className={cn(error && "border-red-500")}
          />
        </div>
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