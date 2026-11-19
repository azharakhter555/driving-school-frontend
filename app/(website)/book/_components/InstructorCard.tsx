import { Check } from "lucide-react";
import type { BookingInstructor } from "@/types/booking.types";

interface InstructorCardProps {
  instructor?: BookingInstructor;
  active: boolean;
  onClick: () => void;
  fallback?: boolean;
}

export function InstructorCard({ instructor, active, onClick, fallback }: InstructorCardProps) {
  const name = fallback ? "Any available" : `${instructor!.firstName} ${instructor!.lastName}`;
  const initials = fallback
    ? "★"
    : `${instructor!.firstName[0]}${instructor!.lastName[0]}`.toUpperCase();

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
        active
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          active ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
        }`}
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold">{name}</div>
        <div className="truncate text-xs text-muted-foreground">
          {fallback ? "We'll match you with a suitable instructor" : "Available for your slot"}
        </div>
      </div>
      {active && <Check className="h-4 w-4 shrink-0 text-primary" />}
    </button>
  );
}
