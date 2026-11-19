// components/shared/inputs/MultiSelectInput.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseInputProps, OptionWithCount } from "@/types/types";

export interface MultiSelectInputProps extends BaseInputProps<string[]> {
  options: OptionWithCount[];
  searchable?: boolean;
  maxItems?: number;
  showCounts?: boolean;
}

export function MultiSelectInput({
  value = [],
  onChange,
  name,
  label,
  placeholder = "Select options",
  disabled,
  required,
  error,
  helperText,
  className,
  id,
  options,
  searchable = true,
  maxItems,
  showCounts = true
}: MultiSelectInputProps) {
  const [open, setOpen] = useState(false);
  const inputId = id || name;

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    
    if (maxItems && newValue.length > maxItems) return;
    onChange(newValue);
  };

  const removeOption = (optionValue: string) => {
    onChange(value.filter(v => v !== optionValue));
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectedOptions = options.filter(opt => value.includes(opt.value));
  const selectedLabels = selectedOptions.map(opt => opt.label).join(", ");

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
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={inputId}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between h-auto min-h-10",
              error && "border-red-500"
            )}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((opt) => (
                  <Badge
                    key={opt.value}
                    variant="secondary"
                    className="mr-1"
                  >
                    {opt.label}
                    {!disabled && (
                      <button
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            removeOption(opt.value);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={() => removeOption(opt.value)}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    )}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            {searchable && <CommandInput placeholder="Search options..." />}
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      disabled={option.disabled}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className={cn(
                          "h-4 w-4 border rounded-sm flex items-center justify-center",
                          isSelected ? "bg-primary border-primary" : "border-input"
                        )}>
                          {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                        </div>
                        {option.icon && <span>{option.icon}</span>}
                        <span>{option.label}</span>
                        {showCounts && option.count !== undefined && (
                          <Badge variant="secondary" className="ml-auto">
                            {option.count}
                          </Badge>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="flex items-center justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-auto px-2 text-xs"
          >
            Clear all
          </Button>
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