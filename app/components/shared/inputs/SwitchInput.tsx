// components/shared/inputs/SwitchInput.tsx
"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseInputProps } from "@/types/types";

export interface SwitchInputProps extends BaseInputProps<boolean> {
  thumbLabel?: string;
  onLabel?: string;
  offLabel?: string;
}

export function SwitchInput({
  value = false,
  onChange,
  name,
  label,
  disabled,
  required,
  error,
  helperText,
  className,
  id,
  thumbLabel,
  onLabel = "On",
  offLabel = "Off"
}: SwitchInputProps) {
  const inputId = id || name;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        {label && (
          <Label 
            htmlFor={inputId}
            className={cn(
              required && "after:content-['*'] after:ml-1 after:text-red-500"
            )}
          >
            {label}
          </Label>
        )}
        {helperText && (
          <span className="text-xs text-muted-foreground">{helperText}</span>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <Switch
          id={inputId}
          checked={value}
          onCheckedChange={onChange}
          disabled={disabled}
          aria-invalid={!!error}
        />
        <span className="text-sm text-muted-foreground">
          {value ? onLabel : offLabel}
        </span>
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