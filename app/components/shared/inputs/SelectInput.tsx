// components/shared/inputs/SelectInput.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BaseInputProps, OptionWithCount } from "@/types/types";

export interface SelectInputProps extends BaseInputProps<string> {
  options: OptionWithCount[];
  clearable?: boolean;
  showCounts?: boolean;
}

export function SelectInput({
  value = "",
  onChange,
  name,
  label,
  placeholder = "Select option",
  disabled,
  required,
  error,
  helperText,
  className,
  id,
  options,
  clearable = true,
  showCounts = true
}: SelectInputProps) {
  const inputId = id || name;

  const handleChange = (val: string) => {
    onChange(val === "__clear__" ? "" : val);
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
      
      <Select 
        value={value} 
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger 
          id={inputId}
          className={cn(error && "border-red-500")}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {clearable && (
            <SelectItem value="__clear__">Clear</SelectItem>
          )}
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              <span className="flex items-center justify-between w-full">
                {option.icon && <span className="mr-2">{option.icon}</span>}
                {option.label}
                {showCounts && option.count !== undefined && (
                  <Badge variant="secondary" className="ml-2">
                    {option.count}
                  </Badge>
                )}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
}