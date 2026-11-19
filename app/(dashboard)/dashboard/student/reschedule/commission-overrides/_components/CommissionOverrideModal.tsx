// app/dashboard/admin/drivers/commission/_components/CommissionOverrideModal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, RotateCcw } from "lucide-react";
import { commissionService } from "@/services/commission/commission.service";
import { toast } from "sonner";
import type { CommissionRow } from "@/types/commission.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: CommissionRow | null;
  onSuccess: () => void;
}

export function CommissionOverrideModal({ open, onOpenChange, row, onSuccess }: Props) {
  const [overrideType, setOverrideType] = useState<"percentage" | "fixed">("percentage");
  const [rate, setRate] = useState<number>(15);
  const [fixedFee, setFixedFee] = useState<number>(10);
  const [note, setNote] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!row) return;
    setOverrideType(row.overrideType);
    setRate(row.overrideRate ?? row.defaultRate);
    setFixedFee(row.fixedFee ?? 10);
    setNote(row.note ?? "");
  }, [row]);

  const handleSave = async () => {
    if (!row) return;
    setSaving(true);
    try {
      await commissionService.updateOverride(row.id, {
        overrideType,
        overrideRate: overrideType === "percentage" ? rate : null,
        fixedFee: overrideType === "fixed" ? fixedFee : null,
        note: note.trim() || null,
      });
      toast.success("Commission override updated");
      onSuccess();
    } catch (e: any) {
      toast.error(e.message || "Failed to update override");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    if (!row) return;
    setSaving(true);
    try {
      await commissionService.clearOverride(row.id);
      toast.success("Override cleared — using default rate");
      onSuccess();
    } catch (e: any) {
      toast.error(e.message || "Failed to clear override");
    } finally {
      setSaving(false);
    }
  };

  // preview commission
  const preview = row
    ? overrideType === "fixed"
      ? fixedFee * row.monthlyLessons
      : (row.monthlyGross * rate) / 100
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Commission Override</DialogTitle>
          <DialogDescription>
            Custom commission for{" "}
            <span className="font-medium text-foreground">
              {row?.user?.firstName} {row?.user?.lastName}
            </span>
            . Default platform rate is {row?.defaultRate}%.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Override Type</Label>
            <Select
              value={overrideType}
              onValueChange={(v) => setOverrideType(v as "percentage" | "fixed")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage of lesson</SelectItem>
                <SelectItem value="fixed">Fixed € per lesson</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {overrideType === "percentage" ? (
            <div className="space-y-2">
              <Label htmlFor="rate">Override Rate (%)</Label>
              <Input
                id="rate"
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Default: {row?.defaultRate}% — set higher or lower for this instructor.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="fee">Fixed Fee (€ per lesson)</Label>
              <Input
                id="fee"
                type="number"
                min={0}
                step={1}
                value={fixedFee}
                onChange={(e) => setFixedFee(Number(e.target.value))}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Reason for override, e.g. volume discount."
            />
          </div>

          {/* Preview */}
          {row && (
            <div className="rounded-lg border bg-muted/40 p-3 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Estimated this month</p>
              <p className="text-lg font-semibold tabular-nums text-primary">
                €{preview.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                Based on {row.monthlyLessons} lessons / €{row.monthlyGross.toFixed(0)} gross.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={saving}
            className="text-muted-foreground"
          >
            <RotateCcw className="mr-2 h-3.5 w-3.5" />
            Reset to Default
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Override
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
