// components/shared/inputs/RatingInput.tsx
"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { AlertCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseInputProps } from "@/types/types";

export interface RatingInputProps extends BaseInputProps<number> {
  max?: number;
  size?: "sm" | "md" | "lg";
  allowHalf?: boolean;
  showValue?: boolean;
}

export function RatingInput({
  value = 0,
  onChange,
  name,
  label,
  disabled,
  required,
  error,
  helperText,
  className,
  id,
  max = 5,
  size = "md",
  allowHalf = false,
  showValue = true
}: RatingInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const inputId = id || name;

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const handleMouseMove = (index: number, event: React.MouseEvent) => {
    if (allowHalf) {
      const { left, width } = event.currentTarget.getBoundingClientRect();
      const percent = (event.clientX - left) / width;
      setHoverValue(percent <= 0.5 ? index + 0.5 : index + 1);
    } else {
      setHoverValue(index + 1);
    }
  };

  const handleClick = (index: number, event: React.MouseEvent) => {
    if (allowHalf) {
      const { left, width } = event.currentTarget.getBoundingClientRect();
      const percent = (event.clientX - left) / width;
      onChange(percent <= 0.5 ? index + 0.5 : index + 1);
    } else {
      onChange(index + 1);
    }
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

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
      
      <div className="flex items-center gap-1">
        <div 
          id={inputId}
          className="flex items-center"
          onMouseLeave={() => setHoverValue(null)}
        >
          {Array.from({ length: max }).map((_, index) => (
            <div
              key={index}
              className="relative cursor-pointer"
              onMouseMove={(e) => !disabled && handleMouseMove(index, e)}
              onClick={(e) => !disabled && handleClick(index, e)}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-colors",
                  index + 1 <= displayValue
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              />
              {allowHalf && index + 0.5 === displayValue && (
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star
                    className={cn(
                      sizeClasses[size],
                      "fill-yellow-400 text-yellow-400"
                    )}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {showValue && (
          <span className="ml-2 text-sm font-medium">
            {value} / {max}
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