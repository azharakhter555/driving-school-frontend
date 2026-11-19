"use client";

import { Input } from "@/components/ui/input";

type Props = {
  start: string;
  end: string;
  onChange: (patch: Partial<{ start: string; end: string }>) => void;
  disabled?: boolean;
  invalid?: boolean;
  errorText?: string;
};

export function TimeRangeInput({ start, end, onChange, disabled, invalid, errorText }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        type="time"
        value={start}
        onChange={(e) => onChange({ start: e.target.value })}
        className="w-32"
        step={900}
        disabled={disabled}
      />
      <span className="text-sm text-muted-foreground">to</span>
      <Input
        type="time"
        value={end}
        onChange={(e) => onChange({ end: e.target.value })}
        className={`w-32 ${invalid ? "border-destructive" : ""}`}
        step={900}
        disabled={disabled}
      />
      {errorText && <span className="text-xs text-destructive">{errorText}</span>}
    </div>
  );
}
