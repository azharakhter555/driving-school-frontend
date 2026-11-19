// src/app/dashboard/admin/videos/_components/VideoListItem.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, Play, Clock, Trash2, Edit, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDuration, formatNumber, formatDate } from "@/lib/utils";
import type { Video } from "@/types/video.types";

interface VideoListItemProps {
  video: Video;
  onView: (video: Video) => void;
  onEdit: (video: Video) => void;
  onDelete: (video: Video) => void;
}

export function VideoListItem({ video, onView, onEdit, onDelete }: VideoListItemProps) {
  const statusColors = {
    published: "bg-green-500",
    draft: "bg-yellow-500",
    archived: "bg-gray-500",
  };

  return (
    <div
      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
      onClick={() => onView(video)}
    >
      {/* Thumbnail */}
      <div className="relative w-40 h-24 flex-shrink-0 bg-muted rounded-md overflow-hidden">
        {video.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="h-8 w-8 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
          <Clock className="h-2.5 w-2.5" />
          {formatDuration(video.duration)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{video.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {video.description}
            </p>
          </div>
          <Badge className={`${statusColors[video.status]} text-white border-0 flex-shrink-0`}>
            {video.status}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{formatNumber(video.views)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            <span>{formatNumber(video.likes)}</span>
          </div>
          <span>•</span>
          <span>{formatDate(video.createdAt, "short")}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => { e.stopPropagation(); onEdit(video); }}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
          onClick={(e) => { e.stopPropagation(); onDelete(video); }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(video); }}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(video); }}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(video); }} className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}