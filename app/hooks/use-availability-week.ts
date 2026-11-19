import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { availabilityService } from "@/services/availability/availability.service";
import type { DayKey, WeeklyAvailability } from "@/types/availability.types";
import { DEFAULT_WEEK } from "@/types/availability.types";
import { addDays, startOfWeek, toISODate } from "@/lib/week-utils";
import { getDefaultUiDays, toDayAvailability, toDayState } from "../lib/availability.mappers";
import type { DayState, WeekState } from "@/types/availability.types";

export function useAvailabilityWeek() {
  // Computed once per mount — stable references so useCallback/useMemo stay effective.
  // (If you want the page to auto-roll over at Sunday→Monday while the tab is open,
  //  add a window focus listener to refresh these — out of scope for now.)
  const [currentWeekStart] = useState(() => startOfWeek(new Date()));
  const [previousWeekStart] = useState(() => addDays(startOfWeek(new Date()), -7));
  const currentWeekStartISO = toISODate(currentWeekStart);
  const previousWeekStartISO = toISODate(previousWeekStart);

  const [weekStart, setWeekStart] = useState(currentWeekStart);
  const [week, setWeek] = useState<WeekState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedFingerprint, setSavedFingerprint] = useState("");

  const weekStartISO = useMemo(() => toISODate(weekStart), [weekStart]);
  const isAtCurrentWeek = weekStartISO === currentWeekStartISO;
  const isAtPreviousWeek = weekStartISO === previousWeekStartISO;
  const isReadOnly = !isAtCurrentWeek;
  const isDirty = week ? JSON.stringify(week) !== savedFingerprint : false;

  // Guards against out-of-order responses when the user clicks weeks quickly.
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    try {
      const data = await availabilityService.getWeek(weekStartISO);
      if (requestId !== requestIdRef.current) return; // stale — user moved on
      const uiState: WeekState = {
        weekStart: weekStartISO,
        days: data.days.map(toDayState),
      };
      setWeek(uiState);
      setSavedFingerprint(JSON.stringify(uiState));
    } catch {
      if (requestId !== requestIdRef.current) return;
      // First visit for this week — seed the default 9–5 template, unsaved.
      setWeek({ weekStart: weekStartISO, days: getDefaultUiDays() });
      setSavedFingerprint("");
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, [weekStartISO]);

  useEffect(() => {
    load();
  }, [load]);

  const updateDay = useCallback(
    (dayKey: DayKey, updater: (d: DayState) => DayState) => {
      if (isReadOnly) return;
      setWeek((prev) =>
        prev
          ? {
              ...prev,
              days: prev.days.map((d) => (d.day === dayKey ? updater(d) : d)),
            }
          : prev
      );
    },
    [isReadOnly]
  );

  const resetToDefault = useCallback(() => {
    if (isReadOnly) return;
    setWeek({ weekStart: weekStartISO, days: getDefaultUiDays() });
  }, [isReadOnly, weekStartISO]);

  const save = useCallback(async () => {
    if (!week || isReadOnly) return;
    setIsSaving(true);
    try {
      const apiData: WeeklyAvailability = {
        ...DEFAULT_WEEK,
        weekStart: week.weekStart,
        days: week.days.map(toDayAvailability),
      };

      const saved = await availabilityService.saveWeek(apiData);
      const uiState: WeekState = {
        weekStart: week.weekStart,
        days: saved.days.map(toDayState),
      };
      setWeek(uiState);
      setSavedFingerprint(JSON.stringify(uiState));
      toast.success("Availability saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  }, [week, isReadOnly]);

  const goToPreviousWeek = useCallback(() => setWeekStart(previousWeekStart), [previousWeekStart]);
  const goToCurrentWeek = useCallback(() => setWeekStart(currentWeekStart), [currentWeekStart]);

  return {
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
  };
}
