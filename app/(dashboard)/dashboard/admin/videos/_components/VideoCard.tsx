// src/app/dashboard/admin/videos/_components/VideoCard.tsx

"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, MoreVertical, Play, Clock, Trash2, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDuration, formatNumber, formatDate } from "@/lib/utils";
import Image from "next/image";
import type { Video } from "@/types/video.types";

interface VideoCardProps {
  video: Video;
  onView: (video: Video) => void;
  onEdit: (video: Video) => void;
  onDelete: (video: Video) => void;
}

export function VideoCard({ video, onView, onEdit, onDelete }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    published: "bg-green-500",
    draft: "bg-yellow-500",
    archived: "bg-gray-500",
  };

  return (
    <Card
      className="group overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView(video)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {video.thumbnail ? (
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <Play className="h-12 w-12 text-primary/40" />
          </div>
        )}
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDuration(video.duration)}
        </div>
        
        {/* Overlay play button on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-all">
            <Play className="h-12 w-12 text-white" />
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-2 left-2">
          <Badge className={`${statusColors[video.status]} text-white border-0`}>
            {video.status}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1 mb-1">{video.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {video.description}
        </p>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{formatNumber(video.views)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            <span>{formatNumber(video.likes)}</span>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {formatDate(video.createdAt, "short")}
          </span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(video); }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDelete(video); }}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}