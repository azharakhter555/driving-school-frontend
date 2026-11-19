// app/dashboard/admin/drivers/commission/_components/CommissionKpiCards.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Coins, Percent, TrendingUp, Users, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommissionKpis } from "@/types/commission.types";

interface Props {
  kpis?: CommissionKpis | null;
  loading?: boolean;
}

export function CommissionKpiCards({ kpis, loading }: Props) {
  const cards = [
    {
      label: "Instructors",
      value: kpis?.totalInstructors ?? 0,
      icon: Users,
      tone: "primary",
    },
    {
      label: "Overridden",
      value: kpis?.overriddenCount ?? 0,
      icon: Award,
      tone: "secondary",
      suffix: `of ${kpis?.totalInstructors ?? 0}`,
    },
    {
      label: "Default Rate",
      value: `${kpis?.defaultRate ?? 0}%`,
      icon: Percent,
      tone: "emerald",
    },
    {
      label: "Avg Effective Rate",
      value: `${kpis?.averageRate?.toFixed(2) ?? "0.00"}%`,
      icon: TrendingUp,
      tone: "primary",
    },
    {
      label: "Monthly Commission",
      value: `€${(kpis?.monthlyCommission ?? 0).toLocaleString("en-IE", { maximumFractionDigits: 0 })}`,
      sub: kpis?.topEarner ? `Top: ${kpis.topEarner.name}` : undefined,
      icon: Coins,
      tone: "amber",
    },
  ];

  const toneClasses: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
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
                {(c.suffix || c.sub) && (
                  <p className="mt-1 text-xs text-muted-foreground truncate">{c.sub ?? c.suffix}</p>
                )}
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
                c.tone === "secondary" && "bg-secondary/60"
              )}
            />
          </Card>
        );
      })}
    </div>
  );
}
