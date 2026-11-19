// components/shared/inputs/ImageInput.tsx
"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseInputProps } from "@/types/types";

export interface ImageInputProps extends BaseInputProps<File | string | null> {
  accept?: string;
  maxSize?: number; // in bytes
  maxWidth?: number;
  maxHeight?: number;
  aspectRatio?: number;
  showPreview?: boolean;
  previewSize?: "sm" | "md" | "lg";
  circular?: boolean;
}

export function ImageInput({
  value = null,
  onChange,
  name,
  label,
  placeholder = "Choose image",
  disabled,
  required,
  error,
  helperText,
  className,
  id,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  maxWidth,
  maxHeight,
  aspectRatio,
  showPreview = true,
  previewSize = "md",
  circular = false
}: ImageInputProps) {
  const [preview, setPreview] = useState<string | null>(
    typeof value === "string" ? value : null
  );
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = id || name;

  const previewSizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  const handleFile = (file: File) => {
    setFileError(null);

    // Check file size
    if (file.size > maxSize) {
      setFileError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    // Check image dimensions
    if (maxWidth || maxHeight || aspectRatio) {
      const img = new Image();
      img.onload = () => {
        if (maxWidth && img.width > maxWidth) {
          setFileError(`Image width must be less than ${maxWidth}px`);
          return;
        }
        if (maxHeight && img.height > maxHeight) {
          setFileError(`Image height must be less than ${maxHeight}px`);
          return;
        }
        if (aspectRatio) {
          const ratio = img.width / img.height;
          if (Math.abs(ratio - aspectRatio) > 0.01) {
            setFileError(`Image must have aspect ratio ${aspectRatio}`);
            return;
          }
        }
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onChange(file);
      };
      img.src = URL.createObjectURL(file);
    } else {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
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
          "hover:border-primary hover:bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed hover:border-border hover:bg-transparent",
          error || fileError ? "border-red-500" : "border-border"
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          name={name}
          accept={accept}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="flex items-center gap-4">
          {showPreview && preview ? (
            <div className={cn(
              "relative flex-shrink-0",
              previewSizeClasses[previewSize],
              circular && "rounded-full overflow-hidden"
            )}>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className={cn(
              "flex-shrink-0 bg-muted rounded-lg flex items-center justify-center",
              previewSizeClasses[previewSize]
            )}>
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            {value && typeof value !== "string" ? (
              <div className="flex items-center justify-between">
                <div className="truncate">
                  <p className="text-sm font-medium truncate">{value.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(value.size / 1024).toFixed(1)} KB
                  </p>
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
              <div>
                <p className="text-sm font-medium">{placeholder}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click or drag to upload (max {maxSize / 1024 / 1024}MB)
                </p>
              </div>
            )}
          </div>
        </div>
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