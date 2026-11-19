// app/dashboard/admin/drivers/payout-history/columns.tsx
"use client";

import { createColumns } from "@/lib/column-factory";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { PayoutRow, PayoutStatus, PayoutMethod } from "@/types/payout.types";

const STATUS_STYLE: Record<PayoutStatus, string> = {
  paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  processing: "bg-primary/10 text-primary border-primary/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
};

const STATUS_LABEL: Record<PayoutStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  processing: "Processing",
  failed: "Failed",
};

const METHOD_LABEL: Record<PayoutMethod, string> = {
  bank_transfer: "Bank Transfer",
  paypal: "PayPal",
  stripe: "Stripe",
  manual: "Manual",
};

function Currency({ value, bold }: { value: number; bold?: boolean }) {
  return (
    <span className={cn("tabular-nums", bold && "font-semibold")}>
      {new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
      }).format(value ?? 0)}
    </span>
  );
}

export const PayoutColumns = (
  onView?: (row: PayoutRow) => void,
  onMarkPaid?: (row: PayoutRow) => void,
  onRetry?: (row: PayoutRow) => void
) => {
  const columns = createColumns<PayoutRow>([
    {
      accessorKey: "reference",
      header: "Reference",
      cell: (value: string) => (
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      ),
    },
    {
      accessorKey: "instructor.firstName",
      header: "Instructor",
      cell: (_v, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.instructor?.avatarUrl ?? undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {row.instructor?.firstName?.[0]}
              {row.instructor?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {row.instructor?.firstName} {row.instructor?.lastName}
            </p>
            <p className="truncate text-xs text-muted-foreground">{row.instructor?.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "periodStart",
      header: "Period",
      cell: (_v, row) => (
        <span className="text-xs whitespace-nowrap">
          {new Date(row.periodStart).toLocaleDateString("en-IE", {
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      accessorKey: "grossAmount",
      header: "Gross",
      cell: (value: number) => <Currency value={value ?? 0} />,
    },
    {
      accessorKey: "commissionAmount",
      header: "Commission",
      cell: (value: number) => (
        <span className="tabular-nums text-muted-foreground">
          − <Currency value={value ?? 0} />
        </span>
      ),
    },
    {
      accessorKey: "netAmount",
      header: "Net Payout",
      cell: (value: number) => (
        <span className="text-primary">
          <Currency value={value ?? 0} bold />
        </span>
      ),
    },
    {
      accessorKey: "method",
      header: "Method",
      cell: (value: PayoutMethod) => (
        <Badge variant="outline">{METHOD_LABEL[value] ?? value}</Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (value: PayoutStatus) => (
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
            STATUS_STYLE[value]
          )}
        >
          {STATUS_LABEL[value] ?? value}
        </span>
      ),
    },
    {
      accessorKey: "paidAt",
      header: "Paid On",
      cell: (value: string | null) =>
        value ? (
          <span className="text-xs whitespace-nowrap">
            {new Date(value).toLocaleDateString("en-IE")}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
  ]);

  if (onView || onMarkPaid || onRetry) {
    columns.push({
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const r = row.original;
        const canMarkPaid = r.status === "pending" || r.status === "processing";
        const canRetry = r.status === "failed";

        return (
          <div className="flex items-center gap-1 justify-end">
            {onView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView(r);
                }}
                className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                View
              </button>
            )}
            {canMarkPaid && onMarkPaid && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkPaid(r);
                }}
                className="rounded-md px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-500/10 transition-colors dark:text-emerald-400"
              >
                Mark Paid
              </button>
            )}
            {canRetry && onRetry && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRetry(r);
                }}
                className="rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        );
      },
    });
  }

  return columns;
};
