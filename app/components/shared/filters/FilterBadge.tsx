/* eslint-disable @typescript-eslint/no-explicit-any */
// components/shared/filters/FilterBadge.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface FilterBadgeProps {
  count: number;
  className?: string;
  showLabel?: boolean;
  variant?: "default" | "secondary" | "outline";
}

export function FilterBadge({ 
  count,
  className, 
  showLabel = true, 
  variant = "secondary" 
}: FilterBadgeProps) {
  // Don't show if count is 0
  if (count === 0) return null;

  return (
    <Badge variant={variant} className={cn("gap-1", className)}>
      {showLabel && <span>Active filters:</span>}
      <span>{count}</span>
    </Badge>
  );
}