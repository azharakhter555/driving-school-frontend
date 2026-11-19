"use client";

import { Lock } from "lucide-react";

type Props = { onGoToCurrentWeek: () => void };

export function ReadOnlyBanner({ onGoToCurrentWeek }: Props) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
      <Lock className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <div className="font-medium">This week is in the past</div>
        <div className="text-amber-800 dark:text-amber-300">
          Availability can only be changed for the current week. Switch back to{" "}
          <button
            type="button"
            className="font-medium underline underline-offset-2 hover:no-underline"
            onClick={onGoToCurrentWeek}
          >
            this week
          </button>{" "}
          to make edits.
        </div>
      </div>
    </div>
  );
}
