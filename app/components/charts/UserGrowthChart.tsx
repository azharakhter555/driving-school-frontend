// components/charts/UserGrowthChart.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Line, 
  LineChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  Legend
} from "recharts";
import { ErrorState } from "@/components/shared/ErrorState";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";

interface UserGrowthChartProps {
  data?: Array<{ month: string; instructors: number; students: number }>;
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export function UserGrowthChart({ 
  data = [],
  title = "User Growth",
  description = "Instructor and student growth over time",
  isLoading = false,
  error = null,
  onRetry,
}: UserGrowthChartProps) {
  
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
            <p className="text-muted-foreground">No growth data available</p>
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
        <div className="h-[300px] w-full  min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
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
                formatter={(value: unknown) => [Number(value).toLocaleString(), '']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="students" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                name="Students"
              />
              <Line 
                type="monotone" 
                dataKey="instructors" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                name="Instructors"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}