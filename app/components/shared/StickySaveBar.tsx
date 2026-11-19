"use client";

import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
  saveLabel?: string;
  discardLabel?: string;
  dirtyLabel?: string;
  savedLabel?: string;
};

export function StickySaveBar({
  isDirty,
  isSaving,
  onSave,
  onDiscard,
  saveLabel = "Save",
  discardLabel = "Discard",
  dirtyLabel = "You have unsaved changes",
  savedLabel = "All changes saved",
}: Props) {
  return (
    <div className="sticky bottom-0 z-40 -mx-4 mt-6 border-t bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          {isDirty ? (
            <span className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
              {dirtyLabel}
            </span>
          ) : (
            <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Check className="h-4 w-4" />
              {savedLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onDiscard} disabled={!isDirty || isSaving}>
            {discardLabel}
          </Button>
          <Button onClick={onSave} disabled={!isDirty || isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saveLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
