"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw, Wand2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { StickySaveBar } from "@/components/shared/StickySaveBar";

import { formatWeekLabel } from "@/lib/week-utils";
import { useAvailabilityWeek } from "@/hooks/use-availability-week";
import { WeekNavigator } from "./components/WeekNavigator";
import { ReadOnlyBanner } from "./components/ReadOnlyBanner";
import { DayRow } from "./components/DayRow";

export default function AvailabilityPage() {
  const {
    weekStart,
    week,
    isLoading,
    isSaving,
    isDirty,
    isReadOnly,
    isAtCurrentWeek,
    isAtPreviousWeek,
    goToPreviousWeek,
    goToCurrentWeek,
    reload: load,
    updateDay,
    resetToDefault,
    save,
  } = useAvailabilityWeek();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/instructor/calendar">
            <Button variant="outline" size="icon" aria-label="Back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Set Availability</h1>
            <p className="text-sm text-muted-foreground">
              Tell students when you&apos;re free to teach — {formatWeekLabel(weekStart)}.
            </p>
          </div>
        </div>

        <WeekNavigator
          isAtCurrentWeek={isAtCurrentWeek}
          isAtPreviousWeek={isAtPreviousWeek}
          onPrevious={goToPreviousWeek}
          onCurrent={goToCurrentWeek}
        />
      </div>

      {isReadOnly && <ReadOnlyBanner onGoToCurrentWeek={goToCurrentWeek} />}

      <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Wand2 className="h-4 w-4" />
          Quick setup:
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resetToDefault}
          disabled={isReadOnly}
          title={isReadOnly ? "Past weeks are read-only" : undefined}
        >
          <RotateCcw className="mr-2 h-3.5 w-3.5" />
          Reset to Mon–Fri 9–5
        </Button>
      </Card>

      {isLoading ? (
        <LoadingSpinner size="lg" text="Loading availability..." />
      ) : week ? (
        <div className="space-y-3">
          {week.days.map((day, idx) => (
            <DayRow
              key={day.day}
              day={day}
              weekStart={weekStart}
              dayIndex={idx}
              readOnly={isReadOnly}
              updateDay={updateDay}
            />
          ))}
        </div>
      ) : null}

      {!isReadOnly && (
        <StickySaveBar
          isDirty={isDirty}
          isSaving={isSaving}
          onSave={save}
          onDiscard={load}
          saveLabel="Save availability"
        />
      )}
    </div>
  );
}
