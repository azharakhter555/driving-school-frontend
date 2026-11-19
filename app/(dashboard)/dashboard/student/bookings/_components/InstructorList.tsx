"use client";

import { Star, MapPin, Car, BadgeCheck, Sparkles } from "lucide-react";
import { InstructorListSkeleton } from "@/components/skeletons/InstructorListSkeleton";
import type { BookingInstructor } from "@/types/booking.types";

interface Props {
  instructors: BookingInstructor[];
  selected: BookingInstructor | null;
  onSelect: (i: BookingInstructor | null) => void;
  loading?: boolean;
  allowAssignLater?: boolean;
}

export function InstructorList({
  instructors,
  selected,
  onSelect,
  loading,
  allowAssignLater = true,
}: Props) {
  if (loading) return <InstructorListSkeleton />;

  return (
    <div className="space-y-3">
      {/* "Assign an instructor for me" card */}
      {allowAssignLater && (
        <button
          onClick={() => onSelect(null)}
          className={`w-full rounded-lg border border-dashed p-4 text-left transition ${
            selected === null
              ? "border-primary bg-primary/5 ring-1 ring-primary"
              : "hover:border-primary hover:bg-accent"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Assign an instructor for me</div>
              <div className="mt-1 text-xs text-muted-foreground">
                We'll match you with the best available instructor and notify you.
              </div>
            </div>
          </div>
        </button>
      )}

      {/* Empty state */}
      {instructors.length === 0 && !allowAssignLater && (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          No instructors available for this time.
        </div>
      )}

      {/* Instructor cards */}
      {instructors.map((ins) => {
        const active = selected?.id === ins.id;
        return (
          <button
            key={ins.id}
            onClick={() => onSelect(ins)}
            className={`w-full rounded-lg border p-4 text-left transition ${
              active
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "hover:border-primary hover:bg-accent"
            }`}
          >
            <div className="flex items-start gap-3">
              <img
                src={ins.avatarUrl || "/avatar-placeholder.png"}
                alt={`${ins.firstName} ${ins.lastName}`}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">
                    {ins.firstName} {ins.lastName}
                  </span>
                  {ins.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                </div>

                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {ins.rating?.toFixed(1) ?? "New"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {ins.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Car className="h-3 w-3" /> {ins.transmission}
                  </span>
                </div>

                <div className="mt-2 text-sm font-medium">€{ins.hourlyRate}/hr</div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
