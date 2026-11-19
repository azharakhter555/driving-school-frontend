// components/shared/inputs/RadioInput.tsx
"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseInputProps, OptionWithCount } from "@/types/types";

export interface RadioInputProps extends BaseInputProps<string> {
  options: OptionWithCount[];
  layout?: "vertical" | "horizontal";
  showCounts?: boolean;
}

export function RadioInput({
  value = "",
  onChange,
  name,
  label,
  disabled,
  required,
  error,
  helperText,
  className,
  id,
  options,
  layout = "vertical",
  showCounts = true
}: RadioInputProps) {
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
      
      <RadioGroup
        id={inputId}
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        className={cn(
          layout === "vertical" ? "space-y-2" : "flex flex-wrap gap-4"
        )}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={`${inputId}-${option.value}`}
              disabled={option.disabled}
            />
            <Label
              htmlFor={`${inputId}-${option.value}`}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              {option.icon && <span>{option.icon}</span>}
              {option.label}
              {showCounts && option.count !== undefined && (
                <Badge variant="secondary">{option.count}</Badge>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
}