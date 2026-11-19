/* eslint-disable @typescript-eslint/no-explicit-any */
// components/shared/filters/FilterSearch.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounce?: number;
  className?: string;
  showButton?: boolean;
  buttonText?: string;
  onSearch?: (value: string) => void;
}

export function FilterSearch({
  value,
  onChange,
  placeholder = "Search...",
  debounce = 300,
  className,
  showButton = false,
  buttonText = "Search",
  onSearch
}: FilterSearchProps) {
  const [localValue, setLocalValue] = useState(value);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced search
  useEffect(() => {
    if (!showButton) {
      const timer = setTimeout(() => {
        if (localValue !== value) {
          onChange(localValue);
          onSearch?.(localValue);
        }
      }, debounce);

      return () => clearTimeout(timer);
    }
  }, [localValue, value, onChange, debounce, showButton, onSearch]);

  const handleSearch = () => {
    onChange(localValue);
    onSearch?.(localValue);
  };

  const handleClear = () => {
    setLocalValue("");
    onChange("");
    onSearch?.("");
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="pl-8 pr-8"
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
            type="button"
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      {showButton && (
        <Button onClick={handleSearch} size="sm">
          {buttonText}
        </Button>
      )}
    </div>
  );
}