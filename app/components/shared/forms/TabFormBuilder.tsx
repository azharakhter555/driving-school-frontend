/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useForm, Controller, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FieldConfig } from "./FormBuilder";

// ─── Types ───────────────────────────────────────────────

export interface TabConfig {
  id: string;
  label: string;
  fields: FieldConfig[];
}

export interface TabFormBuilderProps {
  schema: z.ZodObject<any>;
  defaultValues: Record<string, any>;
  tabs: TabConfig[];
  activeTab?: string;
  onTabChange: (tabId: string) => void;
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
  form?: UseFormReturn<any>;
  hideButtons?: boolean;
  children?: React.ReactNode;
}

export function TabFormBuilder({
  schema,
  defaultValues,
  tabs,
  activeTab,
  onTabChange,
  onSubmit,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  onCancel,
  isLoading = false,
  className,
  form: externalForm,
  hideButtons = false,
  children,
}: TabFormBuilderProps) {
  const internalForm = useForm({
    resolver: zodResolver(schema) as any,
    defaultValues,
  });
  const form = externalForm || internalForm;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  // ✅ Guard against undefined activeTab – fallback to first tab
  const currentTab = activeTab || tabs[0]?.id || "";

  const renderField = (field: FieldConfig) => {
    const commonProps = {
      id: field.name,
      placeholder: field.placeholder,
      className: cn("w-full", field.className),
    };

    switch (field.type) {
      case "text":
      case "email":
      case "date":
        return <Input type={field.type} {...commonProps} {...register(field.name)} />;
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
        return <Textarea rows={4} {...commonProps} {...register(field.name)} />;
      case "select":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <Select onValueChange={controllerField.onChange} value={controllerField.value ?? ""}>
                <SelectTrigger id={field.name}>
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
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-6", className)}>
      <Tabs value={currentTab} onValueChange={onTabChange}>
        <TabsList
          className="grid w-full"
          style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
        >
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-4 pt-4">
            <div className="grid gap-4">
              {tab.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {renderField(field)}
                  {field.description && (
                    <p className="text-xs text-muted-foreground">{field.description}</p>
                  )}
                  {errors?.[field.name] && (
                    <p className="text-sm text-destructive">
                      {(errors as any)[field.name]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {children}

      {!hideButtons && (
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
      )}
    </form>
  );
}
