// app/(dashboard)/dashboard/admin/overview/_components/DashboardStats.tsx
"use client";

import { DollarSign, Users, Calendar, UserCheck } from "lucide-react";
import { StatsCard } from "@/components/shared/StatsCard";
import { formatCurrency, formatNumber, formatChange } from "@/lib/utils";
import type { DashboardStats as DashboardStatsType } from "@/services";

interface DashboardStatsProps {
  stats?: DashboardStatsType;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(stats?.totalRevenue)}
        change={formatChange(stats?.revenueChange)}
        trend={stats?.revenueTrend}
        icon={DollarSign}
        description="vs last month"
      />
      <StatsCard
        title="Total Bookings"
        value={formatNumber(stats?.totalBookings)}
        change={formatChange(stats?.bookingsChange)}
        trend={stats?.bookingsTrend}
        icon={Calendar}
        description={`${stats?.weeklyBookings || 0} this week`}
      />
      <StatsCard
        title="Active Instructors"
        value={formatNumber(stats?.activeInstructors)}
        change={formatChange(stats?.instructorsChange)}
        trend={stats?.instructorsTrend}
        icon={UserCheck}
        description={`${stats?.pendingInstructors || 0} pending approval`}
      />
      <StatsCard
        title="Active Students"
        value={formatNumber(stats?.activeStudents)}
        change={formatChange(stats?.studentsChange)}
        trend={stats?.studentsTrend}
        icon={Users}
        description={`${stats?.newStudents || 0} new this month`}
      />
    </div>
  );
}