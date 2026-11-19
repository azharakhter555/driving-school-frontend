// app/(dashboard)/dashboard/admin/overview/_components/DashboardHeader.tsx
"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  lastUpdated: string;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function DashboardHeader({
  lastUpdated,
  isRefreshing,
  onRefresh,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
      <div className="flex items-center gap-3">
        <Button
          onClick={onRefresh}
          variant="ghost"
          size="icon"
          disabled={isRefreshing}
        >
          <RefreshCw
            className={cn("h-4 w-4", isRefreshing && "animate-spin")}
          />
        </Button>
        <p className="text-sm text-muted-foreground">
          Last updated: {lastUpdated}
        </p>
      </div>
    </div>
  );
}