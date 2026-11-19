/* eslint-disable @typescript-eslint/no-explicit-any */
// components/shared/filters/FilterPresets.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, FolderOpen, Trash2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterPresetsProps {
  values: Record<string, any>;
  onLoad: (values: Record<string, any>) => void;
  storageKey?: string;
  className?: string;
}

interface Preset {
  id: string;
  name: string;
  filters: Record<string, any>;
  createdAt: number;
  isFavorite?: boolean;
}

export function FilterPresets({
  values,
  onLoad,
  storageKey = "filter-presets",
  className
}: FilterPresetsProps) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState("");

  // ✅ Load presets from localStorage ONLY in browser (useEffect)
useEffect(() => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setPresets(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load presets:", error);
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Empty array = runs once after mount
  // Save presets to localStorage
  const savePresets = (newPresets: Preset[]) => {
    setPresets(newPresets);
    // ✅ Check if in browser before using localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(newPresets));
    }
  };

  const handleSavePreset = () => {
    if (!presetName.trim()) return;

    const newPreset: Preset = {
      id: Date.now().toString(),
      name: presetName,
      filters: { ...values },
      createdAt: Date.now()
    };

    const updatedPresets = [...presets, newPreset];
    savePresets(updatedPresets);
    setIsSaveDialogOpen(false);
    setPresetName("");
  };

  const handleLoadPreset = (preset: Preset) => {
    onLoad(preset.filters);
  };

  const handleDeletePreset = (presetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedPresets = presets.filter(p => p.id !== presetId);
    savePresets(updatedPresets);
  };

  const toggleFavorite = (presetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedPresets = presets.map(p => 
      p.id === presetId ? { ...p, isFavorite: !p.isFavorite } : p
    );
    savePresets(updatedPresets);
  };

  const favorites = presets.filter(p => p.isFavorite);
  const others = presets.filter(p => !p.isFavorite);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={cn("gap-2", className)}>
            <FolderOpen size={16} />
            Presets
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>Filter Presets</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setIsSaveDialogOpen(true)}>
            <Save size={14} className="mr-2" />
            Save Current Filters
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {favorites.length > 0 && (
            <>
              <DropdownMenuLabel className="text-xs">Favorites</DropdownMenuLabel>
              {favorites.map(preset => (
                <DropdownMenuItem 
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset)}
                  className="flex justify-between"
                >
                  <span className="truncate flex-1">{preset.name}</span>
                  <div className="flex gap-1">
                    <button 
                      onClick={(e) => toggleFavorite(preset.id, e)}
                      className="hover:opacity-80"
                    >
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    </button>
                    <button 
                      onClick={(e) => handleDeletePreset(preset.id, e)}
                      className="hover:opacity-80"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </>
          )}
          
          {others.map(preset => (
            <DropdownMenuItem 
              key={preset.id}
              onClick={() => handleLoadPreset(preset)}
              className="flex justify-between"
            >
              <span className="truncate flex-1">{preset.name}</span>
              <div className="flex gap-1">
                <button 
                  onClick={(e) => toggleFavorite(preset.id, e)}
                  className="hover:opacity-80"
                >
                  <Star size={14} className="text-gray-400" />
                </button>
                <button 
                  onClick={(e) => handleDeletePreset(preset.id, e)}
                  className="hover:opacity-80"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>
            </DropdownMenuItem>
          ))}
          
          {presets.length === 0 && (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No saved presets
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Filter Preset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="preset-name">Preset Name</Label>
              <Input
                id="preset-name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="e.g., Active Users, Q1 Report, etc."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePreset} disabled={!presetName.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}