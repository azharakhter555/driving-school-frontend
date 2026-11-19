// app/dashboard/admin/drivers/performance/columns.tsx
"use client";

import { createColumns } from "@/lib/column-factory";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InstructorPerformance } from "@/types/performance.types";

// ── Rating stars ──
function RatingStars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              "h-3.5 w-3.5",
              i <= full
                ? "fill-amber-500 text-amber-500"
                : i === full + 1 && half
                  ? "fill-amber-500/50 text-amber-500"
                  : "text-muted-foreground/40"
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground tabular-nums">{value.toFixed(1)}</span>
    </div>
  );
}

// ── Progress bar ──
function ProgressBar({ value, tone = "primary" }: { value: number; tone?: string }) {
  const toneCls =
    tone === "emerald"
      ? "bg-emerald-500"
      : tone === "amber"
        ? "bg-amber-500"
        : tone === "destructive"
          ? "bg-destructive"
          : "bg-primary";
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full transition-all", toneCls)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground w-10 text-right">
        {value.toFixed(0)}%
      </span>
    </div>
  );
}

// ── Trend icon ──
function TrendIcon({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "up")
    return <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-destructive" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

export const PerformanceColumns = (onView?: (row: InstructorPerformance) => void) => {
  const columns = createColumns<InstructorPerformance>([
    {
      accessorKey: "user.firstName",
      header: "Instructor",
      cell: (_value, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.user?.avatarUrl ?? undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {row.user?.firstName?.[0]}
              {row.user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {row.user?.firstName} {row.user?.lastName}
            </p>
            <p className="truncate text-xs text-muted-foreground">{row.user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "county",
      header: "County",
    },
    {
      accessorKey: "averageRating",
      header: "Rating",
      cell: (value: number) => <RatingStars value={value ?? 0} />,
    },
    {
      accessorKey: "totalReviews",
      header: "Reviews",
      cell: (value: number) => <span className="tabular-nums font-medium">{value ?? 0}</span>,
    },
    {
      accessorKey: "passRate",
      header: "Pass Rate",
      cell: (value: number) => (
        <ProgressBar
          value={value ?? 0}
          tone={value >= 80 ? "emerald" : value >= 60 ? "amber" : "destructive"}
        />
      ),
    },
    {
      accessorKey: "completedLessons",
      header: "Lessons",
      cell: (value: number, row) => (
        <span className="tabular-nums text-sm">
          {value ?? 0}
          {row.totalLessons ? (
            <span className="text-muted-foreground"> / {row.totalLessons}</span>
          ) : null}
        </span>
      ),
    },
    {
      accessorKey: "responseTimeHours",
      header: "Response",
      cell: (value: number) => (
        <Badge variant={value <= 4 ? "default" : value <= 12 ? "secondary" : "destructive"}>
          {value?.toFixed(1) ?? "—"}h
        </Badge>
      ),
    },
    {
      accessorKey: "monthlyEarnings",
      header: "This Month",
      cell: (value: number) =>
        new Intl.NumberFormat("en-IE", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        }).format(value ?? 0),
    },
    {
      accessorKey: "trend",
      header: "Trend",
      cell: (value: "up" | "down" | "flat") => <TrendIcon trend={value ?? "flat"} />,
    },
    {
      accessorKey: "lastReviewAt",
      header: "Last Review",
      cell: (value: string | null) => (value ? new Date(value).toLocaleDateString("en-IE") : "—"),
    },
  ]);

  if (onView) {
    columns.push({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(row.original);
          }}
          className="rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
        >
          View
        </button>
      ),
    });
  }

  return columns;
};
