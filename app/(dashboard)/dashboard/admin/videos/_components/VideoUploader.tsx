"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, FileVideo, AlertCircle } from "lucide-react";

interface VideoUploaderProps {
  onUpload: (file: File) => void;
  onRemove?: () => void;
  isUploading?: boolean;
  progress?: number;
  error?: string;
  file?: File | null;
  multiple?: boolean;
}

export function VideoUploader({
  onUpload,
  onRemove,
  isUploading = false,
  progress = 0,
  error,
  file,
  multiple = false,
}: VideoUploaderProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // ✅ Fix: Check if array has at least one file before accessing
      if (acceptedFiles && acceptedFiles.length > 0) {
        const firstFile = acceptedFiles[0];
        if (firstFile) {
          onUpload(firstFile);
        }
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
      "video/quicktime": [".mov"],
    },
    maxSize: 1024 * 1024 * 1024, // 1GB
    multiple,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  if (file) {
    return (
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileVideo className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {isUploading && (
          <div className="mt-3">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Uploading: {progress}%</p>
          </div>
        )}
        
        {error && (
          <div className="mt-3 flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        dragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50"
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
      <p className="text-sm font-medium">
        Drag & drop a video file here, or click to select
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        Supports MP4, WebM, MOV (Max 1GB)
      </p>
    </div>
  );
}