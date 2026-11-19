// components/charts/BookingsChart.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { ErrorState } from "@/components/shared/ErrorState";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";

interface BookingsChartProps {
  data?: Array<{ day: string; bookings: number }>;
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export function BookingsChart({ 
  data = [],
  title = "Weekly Bookings",
  description = "Number of lessons booked per day this week",
  isLoading = false,
  error = null,
  onRetry,
}: BookingsChartProps) {
  
  if (isLoading) {
    return <ChartSkeleton />;
  }

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

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">No booking data available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Bookings will appear here once scheduled
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="day" 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                formatter={(value: unknown) => [`${value} lessons`, 'Bookings']}
              />
              <Bar 
                dataKey="bookings" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}