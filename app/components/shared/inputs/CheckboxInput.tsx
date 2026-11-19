// components/shared/inputs/CheckboxInput.tsx
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BaseInputProps, OptionWithCount } from "@/types/types";

export interface CheckboxInputProps extends BaseInputProps<string[]> {
  options: OptionWithCount[];
  layout?: "vertical" | "horizontal" | "grid";
  columns?: 1 | 2 | 3 | 4;
}

export function CheckboxInput({
  value = [],
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
  columns = 2
}: CheckboxInputProps) {
  const inputId = id || name;

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const layoutClasses = {
    vertical: "flex flex-col space-y-2",
    horizontal: "flex flex-wrap gap-4",
    grid: `grid grid-cols-1 md:grid-cols-${columns} gap-3`
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
      
      <div className={layoutClasses[layout]}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${inputId}-${option.value}`}
              checked={value.includes(option.value)}
              onCheckedChange={() => toggleOption(option.value)}
              disabled={disabled || option.disabled}
            />
            <Label 
              htmlFor={`${inputId}-${option.value}`}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              {option.icon && <span>{option.icon}</span>}
              {option.label}
              {option.count !== undefined && (
                <Badge variant="secondary" className="ml-1">
                  {option.count}
                </Badge>
              )}
            </Label>
          </div>
        ))}
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