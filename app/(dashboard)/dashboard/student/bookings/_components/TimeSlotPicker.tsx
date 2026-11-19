"use client";

import { TimeSlotPickerSkeleton } from "@/components/skeletons/TimeSlotPickerSkeleton";
import type { TimeSlot } from "@/types/booking.types";

interface Props {
  slots: TimeSlot[];
  selected: TimeSlot | null;
  onSelect: (s: TimeSlot) => void;
  loading?: boolean;
}

export function TimeSlotPicker({ slots, selected, onSelect, loading }: Props) {
  if (loading) return <TimeSlotPickerSkeleton />;

  if (slots.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        No slots available on this day. Try another date.
      </div>
    );
  }

  const groups = {
    Morning: slots.filter((s) => s.hour < 12),
    Afternoon: slots.filter((s) => s.hour >= 12 && s.hour < 17),
    Evening: slots.filter((s) => s.hour >= 17),
  };

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([label, group]) =>
        group.length === 0 ? null : (
          <div key={label}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {group.map((slot) => {
                const active = selected?.id === slot.id;
                return (
                  <button
                    key={slot.id}
                    onClick={() => onSelect(slot)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:border-primary hover:bg-accent"
                    }`}
                  >
                    {slot.label}
                    <div className="text-[10px] font-normal opacity-70">
                      {slot.availableCount} available
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
}
