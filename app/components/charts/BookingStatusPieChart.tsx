// components/charts/BookingStatusPieChart.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  Cell,
  Legend
} from "recharts";
import { ErrorState } from "@/components/shared/ErrorState";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";

interface BookingStatusPieChartProps {
  data?: Array<{ name: string; value: number; color: string }>;
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export function BookingStatusPieChart({ 
  data = [],
  title = "Booking Status",
  description = "Distribution of bookings by status",
  isLoading = false,
  error = null,
  onRetry,
}: BookingStatusPieChartProps) {
  
  const total = data.reduce((sum, item) => sum + item.value, 0);

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
            <p className="text-muted-foreground">No status data available</p>
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
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                formatter={(value: unknown) => {
                  const numValue = Number(value) || 0;
                  const percentage = total > 0 ? ((numValue / total) * 100).toFixed(1) : '0.0';
                  return [`${numValue} (${percentage}%)`, 'Bookings'];
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}