// app/dashboard/admin/drivers/payout-history/_components/PayoutKpiCards.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Wallet, Clock, XCircle, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PayoutKpis } from "@/types/payout.types";

interface Props {
  kpis?: PayoutKpis | null;
  loading?: boolean;
}

export function PayoutKpiCards({ kpis, loading }: Props) {
  const cards = [
    {
      label: "Paid This Month",
      value: `€${(kpis?.paidThisMonth ?? 0).toLocaleString("en-IE", { maximumFractionDigits: 0 })}`,
      icon: Wallet,
      tone: "emerald",
    },
    {
      label: "Pending",
      value: `€${(kpis?.pendingAmount ?? 0).toLocaleString("en-IE", { maximumFractionDigits: 0 })}`,
      icon: Clock,
      tone: "amber",
    },
    {
      label: "Failed",
      value: kpis?.failedCount ?? 0,
      icon: XCircle,
      tone: "destructive",
    },
    {
      label: "All-Time Paid",
      value: `€${(kpis?.totalPaidAllTime ?? 0).toLocaleString("en-IE", { maximumFractionDigits: 0 })}`,
      icon: TrendingUp,
      tone: "primary",
    },
    {
      label: "Top Recipient",
      value: kpis?.topRecipient?.name ?? "—",
      sub: kpis?.topRecipient
        ? `€${kpis.topRecipient.amount.toLocaleString("en-IE", { maximumFractionDigits: 0 })}`
        : undefined,
      icon: Users,
      tone: "secondary",
    },
  ];

  const toneClasses: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    destructive: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card
            key={c.label}
            className={cn(
              "relative overflow-hidden p-5 transition-all",
              "hover:shadow-md hover:-translate-y-0.5",
              loading && "animate-pulse"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {c.label}
                </p>
                <p className="mt-2 text-2xl font-bold truncate">{c.value}</p>
                {c.sub && <p className="mt-1 text-xs text-muted-foreground truncate">{c.sub}</p>}
              </div>
              <div className={cn("rounded-lg p-2 shrink-0", toneClasses[c.tone])}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 h-1",
                c.tone === "amber" && "bg-amber-500/60",
                c.tone === "emerald" && "bg-emerald-500/60",
                c.tone === "primary" && "bg-primary/60",
                c.tone === "secondary" && "bg-secondary/60",
                c.tone === "destructive" && "bg-destructive/60"
              )}
            />
          </Card>
        );
      })}
    </div>
  );
}
