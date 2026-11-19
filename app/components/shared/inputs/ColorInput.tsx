// components/shared/inputs/ColorInput.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Pipette } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseInputProps } from "@/types/types";

export interface ColorInputProps extends BaseInputProps<string> {
  presetColors?: string[];
  showPicker?: boolean;
}

export function ColorInput({
  value = "#000000",
  onChange,
  name,
  label,
  placeholder = "Pick a color",
  disabled,
  required,
  error,
  helperText,
  className,
  id,
  presetColors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#000000", "#ffffff"],
  showPicker = true
}: ColorInputProps) {
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
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id={inputId}
            name={name}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={cn(
              "pl-10",
              error && "border-red-500 focus-visible:ring-red-500"
            )}
            style={{ borderLeftColor: value, borderLeftWidth: "4px" }}
          />
          <Pipette 
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" 
            style={{ color: value }}
          />
        </div>
        
        {showPicker && (
          <Input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-12 p-1 h-10"
          />
        )}
      </div>

      {presetColors.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {presetColors.map((color) => (
            <button
              key={color}
              type="button"
              className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring"
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
              disabled={disabled}
              title={color}
            />
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
}