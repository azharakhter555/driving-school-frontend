/* eslint-disable @typescript-eslint/no-explicit-any */
// components/shared/forms/FormBuilder.tsx
"use client";

import type { ReactNode } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// ============================================================================
// TYPES - Simple and pragmatic
// ============================================================================

export type FieldType =
  | "text"
  | "email"
  | "number"
  | "date"
  | "select"
  | "textarea"
  | "custom";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  className?: string;
}

export interface FormBuilderProps {
  schema: z.ZodObject<any>;
  defaultValues: Record<string, any>;
  fields: FieldConfig[];
  onSubmit: (data: Record<string, unknown>) => void | Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
  children?: ReactNode;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function FormBuilder({
  schema,
  defaultValues,
  fields,
  onSubmit,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  onCancel,
  isLoading = false,
  className,
  children,
}: FormBuilderProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    // @ts-expect-error - Known type limitation with Zod + RHF
    resolver: zodResolver(schema),
    defaultValues,
  });

  const renderField = (field: FieldConfig): ReactNode => {
    const commonProps = {
      id: field.name,
      placeholder: field.placeholder,
      className: "w-full",
    };

    switch (field.type) {
      case "text":
      case "email":
      case "date":
        return (
          <Input
            type={field.type}
            {...commonProps}
            {...register(field.name)}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            min={field.min}
            max={field.max}
            {...commonProps}
            {...register(field.name, { valueAsNumber: true })}
          />
        );

      case "textarea":
        return (
          <Textarea rows={4} {...commonProps} {...register(field.name)} />
        );

      case "select":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <Select
                onValueChange={controllerField.onChange}
                value={controllerField.value ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-6", className)}
    >
      <div className="grid gap-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>

            {renderField(field)}

            {field.description && (
              <p className="text-xs text-muted-foreground">
                {field.description}
              </p>
            )}

            {errors?.[field.name] && (
              <p className="text-sm text-destructive">
                {errors[field.name]?.message as string}
              </p>
            )}
          </div>
        ))}
      </div>

      {children}

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}