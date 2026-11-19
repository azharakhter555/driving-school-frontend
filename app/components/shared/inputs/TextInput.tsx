// components/shared/inputs/TextInput.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseInputProps } from "@/types/types";

export interface TextInputProps extends BaseInputProps<string> {
  type?: "text" | "email" | "password" | "tel" | "url";
  debounce?: number;
  icon?: React.ReactNode;
  clearable?: boolean;
}

export function TextInput({
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
  type = "text",
  debounce,
  icon,
  clearable = true
}: TextInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const inputId = id || name;

  // Handle debounce
  useEffect(() => {
    if (debounce) {
      const timer = setTimeout(() => {
        if (localValue !== value) {
          onChange(localValue);
        }
      }, debounce);
      return () => clearTimeout(timer);
    }
  }, [localValue, onChange, debounce, value]);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (!debounce) {
      onChange(newValue);
    }
  };

  const handleClear = () => {
    setLocalValue("");
    onChange("");
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
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        
        <Input
          id={inputId}
          name={name}
          type={type}
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={!!error}
          className={cn(
            icon && "pl-10",
            clearable && localValue && "pr-8",
            error && "border-red-500 focus-visible:ring-red-500"
          )}
        />
        
        {clearable && localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
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