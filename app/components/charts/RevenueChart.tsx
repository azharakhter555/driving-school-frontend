// components/charts/RevenueChart.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { ErrorState } from "@/components/shared/ErrorState";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";

interface RevenueChartProps {
  data?: Array<{ month: string; revenue: number }>;
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export function RevenueChart({ 
  data = [], 
  title = "Revenue Overview",
  description = "Monthly revenue trend for the current year",
  isLoading = false,
  error = null,
  onRetry,
}: RevenueChartProps) {
  
  // Loading state
  if (isLoading) {
    return <ChartSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <ErrorState 
            error={error} 
            onRetry={onRetry}
            title="Failed to load chart"
            variant="warning"
          />
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">No revenue data available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Data will appear once bookings are made
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success state
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
                tickFormatter={(value) => `€${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                formatter={(value: unknown) => [`€${Number(value).toLocaleString()}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}