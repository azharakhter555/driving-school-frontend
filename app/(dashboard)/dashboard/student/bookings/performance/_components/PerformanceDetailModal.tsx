// app/dashboard/admin/drivers/performance/_components/PerformanceDetailModal.tsx
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
import { Loader2, Star, CheckCircle2, Clock, DollarSign } from "lucide-react";
import { performanceService } from "@/services/performance/performance.service";
import type { InstructorPerformance } from "@/types/performance.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instructor: InstructorPerformance | null;
}

export function PerformanceDetailModal({ open, onOpenChange, instructor }: Props) {
  const [detail, setDetail] = useState<InstructorPerformance | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !instructor) return;
    setLoading(true);
    performanceService
      .getInstructorDetail(instructor.id)
      .then((res) => setDetail(res.data ?? instructor))
      .catch(() => setDetail(instructor))
      .finally(() => setLoading(false));
  }, [open, instructor]);

  const data = detail ?? instructor;
  if (!data) return null;

  const stats = [
    { label: "Rating", value: data.averageRating?.toFixed(2), icon: Star, tone: "text-amber-500" },
    {
      label: "Pass Rate",
      value: `${data.passRate?.toFixed(0)}%`,
      icon: CheckCircle2,
      tone: "text-emerald-500",
    },
    {
      label: "Response",
      value: `${data.responseTimeHours?.toFixed(1)}h`,
      icon: Clock,
      tone: "text-primary",
    },
    {
      label: "Earnings",
      value: `€${data.monthlyEarnings?.toFixed(0)}`,
      icon: DollarSign,
      tone: "text-secondary",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <Card key={s.label} className="p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon className={`h-3.5 w-3.5 ${s.tone}`} />
                      {s.label}
                    </div>
                    <p className="mt-1.5 text-lg font-semibold tabular-nums">{s.value ?? "—"}</p>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <Row label="County" value={data.county ?? "—"} />
                <Row
                  label="Transmission"
                  value={<Badge variant="secondary">{data.transmission}</Badge>}
                />
                <Row label="Experience" value={`${data.yearsOfExperience} years`} />
              </div>
              <div className="space-y-2">
                <Row label="Total Reviews" value={data.totalReviews} />
                <Row label="Completed Lessons" value={data.completedLessons} />
                <Row label="Cancelled" value={data.cancelledLessons} />
              </div>
            </div>
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
