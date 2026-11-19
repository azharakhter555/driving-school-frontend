// components/charts/TopInstructorsChart.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, TrendingUp } from "lucide-react";
import { getInitials, formatCurrency } from "@/lib/utils";
import { ErrorState } from "@/components/shared/ErrorState";

interface TopInstructor {
  id: string;
  name: string;
  avatar: string | null;
  bookings: number;
  revenue: number;
  rating: number;
}

interface TopInstructorsChartProps {
  data?: TopInstructor[];
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export function TopInstructorsChart({ 
  data = [],
  title = "Top Performing Instructors",
  description = "Instructors with the highest number of completed lessons",
  isLoading = false,
  error = null,
  onRetry,
}: TopInstructorsChartProps) {
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-4 bg-muted animate-pulse rounded" />
                  <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                  </div>
                </div>
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <ErrorState 
            error={error} 
            onRetry={onRetry}
            title="Failed to load instructors"
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
        <CardContent>
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-sm text-muted-foreground">No instructors found</p>
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
        <div className="space-y-4">
          {data.map((instructor, index) => (
            <div key={instructor.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground w-5">
                  #{index + 1}
                </span>
                <Avatar className="h-8 w-8">
                  {instructor.avatar && <AvatarImage src={instructor.avatar} alt={instructor.name} />}
                  <AvatarFallback>{getInitials(instructor.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{instructor.name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">{instructor.rating}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{instructor.bookings} lessons</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(instructor.revenue)}</p>
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}