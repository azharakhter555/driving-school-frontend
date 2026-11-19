// components/shared/inputs/TextareaInput.tsx
"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseInputProps } from "@/types/types";

export interface TextareaInputProps extends BaseInputProps<string> {
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

export function TextareaInput({
  value = "",
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
  rows = 4,
  maxLength,
  showCount = false,
  resize = "vertical"
}: TextareaInputProps) {
  const inputId = id || name;
  const charCount = value?.length || 0;

  const resizeClasses = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize"
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
      
      <Textarea
        id={inputId}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={cn(
          resizeClasses[resize],
          error && "border-red-500 focus-visible:ring-red-500"
        )}
        aria-invalid={!!error}
      />

      <div className="flex items-center justify-between">
        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle size={14} />
            {error}
          </p>
        )}
        {showCount && maxLength && (
          <p className="text-xs text-muted-foreground ml-auto">
            {charCount} / {maxLength}
          </p>
        )}
      </div>
    </div>
  );
}