// components/shared/inputs/FileInput.tsx
"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, Upload, X, File } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseInputProps } from "@/types/types";

export interface FileInputProps extends BaseInputProps<File | null> {
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
  showPreview?: boolean;
}

export function FileInput({
  value = null,
  onChange,
  name,
  label,
  placeholder = "Choose file",
  disabled,
  required,
  error,
  helperText,
  className,
  id,
  accept,
  maxSize,
  multiple = false,
  showPreview = true
}: FileInputProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = id || name;

  const handleFile = (file: File) => {
    setFileError(null);

    if (maxSize && file.size > maxSize) {
      setFileError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    onChange(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label 
            htmlFor={inputId}
            className={cn(
              required && "after:content-['*'] after:ml-1 after:text-red-500"
            )}
          >
            {label}
          </Label>
          {helperText && (
            <span className="text-xs text-muted-foreground">{helperText}</span>
          )}
        </div>
      )}
      
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-4 transition-colors",
          dragActive && "border-primary bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed",
          error || fileError ? "border-red-500" : "border-border"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        {value ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <File size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium">{value.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(value.size)}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">{placeholder}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Drag and drop or click to select
            </p>
          </div>
        )}
      </div>

      {(error || fileError) && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle size={14} />
          {error || fileError}
        </p>
      )}
    </div>
  );
}