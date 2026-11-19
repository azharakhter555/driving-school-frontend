// app/dashboard/admin/drivers/payout-history/_components/PayoutDetailModal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, Download, CheckCircle2, XCircle, Clock, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { payoutService } from "@/services/payout/payout.service";
import { toast } from "sonner";
import type { PayoutRow } from "@/types/payout.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: PayoutRow | null;
}

const STATUS_STYLE = {
  paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  processing: "bg-primary/10 text-primary border-primary/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
} as const;

const STATUS_ICON = {
  paid: CheckCircle2,
  pending: Clock,
  processing: Clock,
  failed: XCircle,
} as const;

function Currency({ value }: { value: number }) {
  return (
    <>
      {new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
      }).format(value ?? 0)}
    </>
  );
}

export function PayoutDetailModal({ open, onOpenChange, row }: Props) {
  const [detail, setDetail] = useState<PayoutRow | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !row) return;
    setLoading(true);
    payoutService
      .getRow(row.id)
      .then((res) => setDetail(res.data))
      .catch(() => setDetail(row))
      .finally(() => setLoading(false));
  }, [open, row]);

  const data = detail ?? row;
  if (!data) return null;

  const StatusIcon = STATUS_ICON[data.status];

  const copyRef = () => {
    navigator.clipboard.writeText(data.reference);
    toast.success("Reference copied");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-12 w-12">
                <AvatarImage src={data.instructor?.avatarUrl ?? undefined} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {data.instructor?.firstName?.[0]}
                  {data.instructor?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <DialogTitle className="truncate">
                  {data.instructor?.firstName} {data.instructor?.lastName}
                </DialogTitle>
                <DialogDescription className="truncate">{data.instructor?.email}</DialogDescription>
              </div>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
                STATUS_STYLE[data.status]
              )}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
            </span>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-5">
            {/* Reference */}
            <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Reference
                </p>
                <p className="font-mono text-sm font-medium">{data.reference}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyRef}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Period */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Period Start</p>
                <p className="font-medium">
                  {new Date(data.periodStart).toLocaleDateString("en-IE")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Period End</p>
                <p className="font-medium">
                  {new Date(data.periodEnd).toLocaleDateString("en-IE")}
                </p>
              </div>
            </div>

            <Separator />

            {/* Amount breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Gross Earnings</span>
                <span className="tabular-nums font-medium">
                  <Currency value={data.grossAmount} />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Commission</span>
                <span className="tabular-nums font-medium text-muted-foreground">
                  − <Currency value={data.commissionAmount} />
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-base">
                <span className="font-semibold">Net Payout</span>
                <span className="tabular-nums font-bold text-primary">
                  <Currency value={data.netAmount} />
                </span>
              </div>
            </div>

            <Separator />

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <MetaRow label="Method" value={<Badge variant="outline">{data.method}</Badge>} />
              <MetaRow label="County" value={data.county} />
              <MetaRow
                label="Paid On"
                value={data.paidAt ? new Date(data.paidAt).toLocaleDateString("en-IE") : "—"}
              />
              <MetaRow label="Processed By" value={data.processedBy ?? "—"} />
            </div>

            {data.failureReason && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <div className="flex items-center gap-2 mb-1 text-destructive">
                  <XCircle className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Failure Reason</span>
                </div>
                <p className="text-sm text-destructive/90">{data.failureReason}</p>
              </div>
            )}

            {data.note && (
              <div className="rounded-lg border bg-muted/40 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Note</p>
                <p className="text-sm">{data.note}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button variant="secondary">
                <Download className="mr-2 h-3.5 w-3.5" />
                Receipt
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
