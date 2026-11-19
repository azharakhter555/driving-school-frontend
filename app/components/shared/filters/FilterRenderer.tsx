/* eslint-disable @typescript-eslint/no-explicit-any */

// components/shared/filters/FilterRenderer.tsx
"use client";

import { Inputs } from "@/components/shared/inputs";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FilterConfig } from "@/types/filter";

export interface FilterRendererProps {
  config: FilterConfig;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  touched?: boolean;
  onBlur?: () => void;
  className?: string;
}

export function FilterRenderer({
  config,
  value,
  onChange,
  error,
  touched,
  onBlur,
  className
}: FilterRendererProps) {
  const {
    id,
    label,
    type,
    placeholder,
    options,
    disabled,
    validation,
    props = {},
    width = "full"
  } = config;

  // Width classes for grid layouts
  const widthClasses = {
    full: "col-span-full",
    half: "col-span-1",
    third: "col-span-1 md:col-span-1",
    quarter: "col-span-1 md:col-span-1 lg:col-span-1"
  };

  // Safely access props with type assertion
  const helperText = (props as any).helperText;
  const maxLength = (props as any).maxLength;

  // Get required from validation
  const isRequired = validation?.required;

  // Prepare common props for all inputs
  const commonProps = {
    id,
    name: id,
    label,
    placeholder,
    disabled,
    required: isRequired, // 👈 Use isRequired from validation
    error: touched ? error : undefined,
    onBlur,
    className: cn(
      widthClasses[width],
      className
    ),
    ...props
  };

  // Render different input types
  const renderInput = () => {
    switch (type) {
      case "text":
      case "email":
      case "password":
        return (
          <Inputs.Text
            {...commonProps}
            type={type}
            value={value ?? ""}
            onChange={onChange}
          />
        );

      case "textarea":
        return (
          <Inputs.Textarea
            {...commonProps}
            value={value ?? ""}
            onChange={onChange}
          />
        );

      case "select":
        return (
          <Inputs.Select
            {...commonProps}
            value={value ?? ""}
            onChange={onChange}
            options={options || []}
          />
        );

      case "multi-select":
        return (
          <Inputs.MultiSelect
            {...commonProps}
            value={value ?? []}
            onChange={onChange}
            options={options || []}
          />
        );

      case "checkbox":
        return (
          <Inputs.Checkbox
            {...commonProps}
            value={value ?? []}
            onChange={onChange}
            options={options || []}
          />
        );

      case "radio":
        return (
          <Inputs.Radio
            {...commonProps}
            value={value ?? ""}
            onChange={onChange}
            options={options || []}
          />
        );

      case "switch":
        return (
          <Inputs.Switch
            {...commonProps}
            value={value ?? false}
            onChange={onChange}
          />
        );

      case "date":
        return (
          <Inputs.Date
            {...commonProps}
            value={value}
            onChange={onChange}
          />
        );

      case "date-range":
        return (
          <Inputs.DateRange
            {...commonProps}
            value={value ?? { from: undefined, to: undefined }}
            onChange={onChange}
          />
        );

      case "time":
        return (
          <Inputs.Time
            {...commonProps}
            value={value ?? ""}
            onChange={onChange}
          />
        );

      case "datetime":
        return (
          <Inputs.DateTime
            {...commonProps}
            value={value}
            onChange={onChange}
          />
        );

      case "number":
        return (
          <Inputs.Number
            {...commonProps}
            value={value}
            onChange={onChange}
            min={validation?.min}
            max={validation?.max}
          />
        );

      case "number-range":
        return (
          <Inputs.NumberRange
            {...commonProps}
            value={value ?? { min: undefined, max: undefined }}
            onChange={onChange}
            min={validation?.min}
            max={validation?.max}
          />
        );

      case "slider":
        return (
          <Inputs.Slider
            {...commonProps}
            value={value ?? [0]}
            onChange={onChange}
            min={validation?.min}
            max={validation?.max}
          />
        );

      case "rating":
        return (
          <Inputs.Rating
            {...commonProps}
            value={value ?? 0}
            onChange={onChange}
          />
        );

      case "color":
        return (
          <Inputs.Color
            {...commonProps}
            value={value ?? "#000000"}
            onChange={onChange}
          />
        );

      case "file":
        return (
          <Inputs.File
            {...commonProps}
            value={value}
            onChange={onChange}
          />
        );

      case "image":
        return (
          <Inputs.Image
            {...commonProps}
            value={value}
            onChange={onChange}
          />
        );

      default:
        return (
          <Inputs.Text
            {...commonProps}
            value={value ?? ""}
            onChange={onChange}
          />
        );
    }
  };

  return (
    <div className={cn("space-y-1", widthClasses[width], className)}>
      {renderInput()}
      
      {/* Helper text with tooltip */}
      {helperText && !error && (
        <div className="flex items-center gap-1 px-1">
          <Info className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{helperText}</span>
        </div>
      )}

      {/* Character count for text inputs */}
      {type === "text" && maxLength && value && typeof value === 'string' && (
        <div className="flex justify-end">
          <Badge variant="secondary" className="text-xs">
            {value.length} / {maxLength}
          </Badge>
        </div>
      )}
    </div>
  );
}