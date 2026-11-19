// app/dashboard/admin/drivers/commission/columns.tsx
"use client";

import { createColumns } from "@/lib/column-factory";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { CommissionRow } from "@/types/commission.types";

function Currency({ value }: { value: number }) {
  return (
    <span className="tabular-nums font-medium">
      {new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(value ?? 0)}
    </span>
  );
}

function RateCell({ row }: { row: CommissionRow }) {
  const isOverridden = row.overrideRate !== null || row.overrideType === "fixed";

  if (row.overrideType === "fixed" && row.fixedFee !== null) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary">€{row.fixedFee} / lesson</Badge>
        <span className="text-xs text-muted-foreground">fixed</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="tabular-nums font-semibold">{row.effectiveRate}%</span>
      {isOverridden && row.overrideRate !== null && row.overrideRate !== row.defaultRate ? (
        <span className="text-xs text-muted-foreground line-through">{row.defaultRate}%</span>
      ) : null}
    </div>
  );
}

export const CommissionColumns = (
  onView?: (row: CommissionRow) => void,
  onOverride?: (row: CommissionRow) => void
) => {
  const columns = createColumns<CommissionRow>([
    {
      accessorKey: "user.firstName",
      header: "Instructor",
      cell: (_v, row) => (
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
      accessorKey: "effectiveRate",
      header: "Commission Rate",
      cell: (_v, row) => <RateCell row={row} />,
    },
    {
      accessorKey: "monthlyLessons",
      header: "Lessons",
      cell: (value: number) => <span className="tabular-nums">{value ?? 0}</span>,
    },
    {
      accessorKey: "monthlyGross",
      header: "Gross",
      cell: (value: number) => <Currency value={value ?? 0} />,
    },
    {
      accessorKey: "monthlyCommission",
      header: "This Month",
      cell: (value: number) => (
        <span className="tabular-nums font-semibold text-primary">
          <Currency value={value ?? 0} />
        </span>
      ),
    },
    {
      accessorKey: "totalCommission",
      header: "Lifetime",
      cell: (value: number) => <Currency value={value ?? 0} />,
    },
    {
      accessorKey: "lastOverrideAt",
      header: "Last Override",
      cell: (value: string | null, row) => {
        if (!value) return <Badge variant="outline">Default</Badge>;
        return (
          <div className="flex flex-col">
            <span className="text-xs">{new Date(value).toLocaleDateString("en-IE")}</span>
            {row.overriddenBy && (
              <span className="text-[10px] text-muted-foreground">by {row.overriddenBy}</span>
            )}
          </div>
        );
      },
    },
  ]);

  if (onView || onOverride) {
    columns.push({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          {onView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(row.original);
              }}
              className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              View
            </button>
          )}
          {onOverride && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOverride(row.original);
              }}
              className="rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              Override
            </button>
          )}
        </div>
      ),
    });
  }

  return columns;
};
