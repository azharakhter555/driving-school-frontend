/* eslint-disable @typescript-eslint/no-explicit-any */
// components/shared/filters/FilterClearAll.tsx
"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterClearAllProps {
  onClear: () => void;  // 👈 Pass from hook
  count: number;        // 👈 Pass from hook
  className?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function FilterClearAll({
  onClear,
  count,
  className,
  variant = "ghost",
  size = "sm",
  showIcon = true,
  children = "Clear all"
}: FilterClearAllProps) {
  if (count === 0) return null;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClear}
      className={cn("gap-2", className)}
    >
      {showIcon && <X size={14} />}
      {children}
    </Button>
  );
}