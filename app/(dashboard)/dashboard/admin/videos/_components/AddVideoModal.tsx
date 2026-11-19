/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { VideoUploader } from "./VideoUploader";
import { useCreateVideo } from "@/hooks/useVideos";
import { videoFormSchema, type VideoFormData, VIDEO_CATEGORIES, VIDEO_STATUS } from "@/lib/validators/video.validator";
import { toast } from "sonner";

interface AddVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddVideoModal({ open, onOpenChange, onSuccess }: AddVideoModalProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { mutate: createVideo, isLoading: isPending } = useCreateVideo();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoFormSchema as any),
    defaultValues: {
      title: "",
      description: "",
      category: "driving-lessons",
      status: "draft",
      tags: [], // Changed from "" to [] array
      duration: 0,
    },
  });

  // Helper function to get video duration
  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.round(video.duration));
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const onSubmit = async (data: VideoFormData) => {
    if (!videoFile) {
      toast.error("Please select a video file");
      return;
    }

    // Get duration from video file
    const duration = await getVideoDuration(videoFile);

    // Create VideoFormData object matching the expected type
    const videoData: any = {
      title: data.title,
      description: data.description || "",
      category: data.category,
      status: data.status,
      tags: data.tags || [], // Already an array
      duration: duration,
      videoFile: videoFile,
    };

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const interval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      await createVideo(videoData);
      clearInterval(interval);
      setUploadProgress(100);
      
      toast.success("Video uploaded successfully!");
      reset();
      setVideoFile(null);
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload video");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (!isUploading && !isPending) {
      reset();
      setVideoFile(null);
      onOpenChange(false);
    }
  };

  // Handle tags input as comma-separated string
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString ? tagsString.split(",").map(tag => tag.trim()).filter(tag => tag) : [];
    setValue("tags", tagsArray);
  };

  // Convert tags array to display string for the input
  const tagsDisplayValue = watch("tags")?.join(", ") || "";

  // Helper function to get display label for category
  const getCategoryLabel = (value: string): string => {
    const labels: Record<string, string> = {
      "driving-lessons": "Driving Lessons",
      "parking-tips": "Parking Tips",
      "road-safety": "Road Safety",
      "exam-prep": "Exam Preparation",
      "vehicle-maintenance": "Vehicle Maintenance",
    };
    return labels[value] || value;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload New Video</DialogTitle>
          <DialogDescription>
            Add a new video to your library. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Video Upload */}
          <div className="space-y-2">
            <Label>Video File *</Label>
            <VideoUploader
              onUpload={setVideoFile}
              onRemove={() => setVideoFile(null)}
              file={videoFile}
              isUploading={isUploading}
              progress={uploadProgress}
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter video title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter video description"
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                onValueChange={(value) => setValue("category", value as VideoFormData["category"])}
                value={watch("category")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {VIDEO_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {getCategoryLabel(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                onValueChange={(value) => setValue("status", value as VideoFormData["status"])}
                value={watch("status")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {VIDEO_STATUS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              placeholder="e.g., driving, parking, safety"
              value={tagsDisplayValue}
              onChange={handleTagsChange}
            />
            {errors.tags && (
              <p className="text-sm text-destructive">{errors.tags.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading || isPending}>
              {isUploading ? "Uploading..." : "Upload Video"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}