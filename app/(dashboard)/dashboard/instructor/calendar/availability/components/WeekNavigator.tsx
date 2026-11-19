"use client";

import { Button } from "@/components/ui/button";

type Props = {
  isAtCurrentWeek: boolean;
  isAtPreviousWeek: boolean;
  onPrevious: () => void;
  onCurrent: () => void;
};

export function WeekNavigator({ isAtCurrentWeek, isAtPreviousWeek, onPrevious, onCurrent }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onPrevious} disabled={isAtPreviousWeek}>
        Previous week
      </Button>
      <Button variant="outline" size="sm" onClick={onCurrent} disabled={isAtCurrentWeek}>
        This week
      </Button>
    </div>
  );
}
