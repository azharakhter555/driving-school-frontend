"use client";

import { memo } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { timeToMinutes } from "@/lib/week-utils";
import { TimeRangeInput } from "@/components/shared/inputs/TimeRangeInput";
import type { Break } from "@/types/availability.types";

type Props = {
  breakStart: string;
  breakEnd: string;
  workingStart: string;
  workingEnd: string;
  readOnly: boolean;
  onChange: (patch: Partial<Break>) => void;
  onRemove: () => void;
};

export const BreakRow = memo(function BreakRow({
  breakStart,
  breakEnd,
  workingStart,
  workingEnd,
  readOnly,
  onChange,
  onRemove,
}: Props) {
  const bs = timeToMinutes(breakStart);
  const be = timeToMinutes(breakEnd);
  const ws = timeToMinutes(workingStart);
  const we = timeToMinutes(workingEnd);

  let errorText = "";
  if (be <= bs) errorText = "End must be after start";
  else if (bs < ws || be > we) errorText = "Must be within working hours";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <TimeRangeInput
        start={breakStart}
        end={breakEnd}
        onChange={onChange}
        disabled={readOnly}
        invalid={Boolean(errorText)}
        errorText={errorText}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={readOnly}
        aria-label="Remove break"
        title={readOnly ? "Past weeks are read-only" : undefined}
        className="ml-auto text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
});
