// src/app/dashboard/admin/videos/_components/VideoViewToggle.tsx

"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

interface VideoViewToggleProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export function VideoViewToggle({ view, onViewChange }: VideoViewToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg border bg-muted/20">
      <Button
        variant={view === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("grid")}
        className="h-8 px-3"
      >
        <LayoutGrid className="h-4 w-4 mr-1" />
        Grid
      </Button>
      <Button
        variant={view === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("list")}
        className="h-8 px-3"
      >
        <List className="h-4 w-4 mr-1" />
        List
      </Button>
    </div>
  );
}