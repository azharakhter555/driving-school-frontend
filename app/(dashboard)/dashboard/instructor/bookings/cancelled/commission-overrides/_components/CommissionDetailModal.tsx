// app/dashboard/admin/drivers/commission/_components/CommissionDetailModal.tsx
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
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Coins, Percent, Calendar, User } from "lucide-react";
import { commissionService } from "@/services/commission/commission.service";
import type { CommissionRow } from "@/types/commission.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: CommissionRow | null;
}

export function CommissionDetailModal({ open, onOpenChange, row }: Props) {
  const [detail, setDetail] = useState<CommissionRow | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !row) return;
    setLoading(true);
    commissionService
      .getRow(row.id)
      .then((res) => setDetail(res.data))
      .catch(() => setDetail(row))
      .finally(() => setLoading(false));
  }, [open, row]);

  const data = detail ?? row;
  if (!data) return null;

  const stats = [
    {
      label: "Effective Rate",
      value: `${data.effectiveRate}%`,
      icon: Percent,
      tone: "text-primary",
    },
    {
      label: "This Month",
      value: `€${data.monthlyCommission.toFixed(0)}`,
      icon: Coins,
      tone: "text-amber-500",
    },
    {
      label: "Lifetime",
      value: `€${data.totalCommission.toFixed(0)}`,
      icon: Calendar,
      tone: "text-secondary",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={data.user?.avatarUrl ?? undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {data.user?.firstName?.[0]}
                {data.user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <DialogTitle className="truncate">
                {data.user?.firstName} {data.user?.lastName}
              </DialogTitle>
              <DialogDescription className="truncate">{data.user?.email}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <Card key={s.label} className="p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon className={`h-3.5 w-3.5 ${s.tone}`} />
                      {s.label}
                    </div>
                    <p className="mt-1.5 text-lg font-semibold tabular-nums">{s.value}</p>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <Row label="Default Rate" value={`${data.defaultRate}%`} />
                <Row
                  label="Override"
                  value={
                    data.overrideRate === null && data.overrideType !== "fixed" ? (
                      <Badge variant="outline">None — using default</Badge>
                    ) : data.overrideType === "fixed" ? (
                      <Badge variant="secondary">€{data.fixedFee} / lesson</Badge>
                    ) : (
                      <Badge>{data.overrideRate}%</Badge>
                    )
                  }
                />
                <Row label="Lessons This Month" value={data.monthlyLessons} />
                <Row label="Gross This Month" value={`€${data.monthlyGross.toFixed(0)}`} />
              </div>
              <div className="space-y-2">
                <Row label="County" value={data.county} />
                <Row
                  label="Transmission"
                  value={<Badge variant="secondary">{data.transmission}</Badge>}
                />
                <Row label="Experience" value={`${data.yearsOfExperience} years`} />
                {data.overriddenBy && <Row label="Overridden By" value={data.overriddenBy} />}
              </div>
            </div>

            {data.note && (
              <div className="rounded-lg border bg-muted/40 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Note</p>
                <p className="text-sm">{data.note}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
