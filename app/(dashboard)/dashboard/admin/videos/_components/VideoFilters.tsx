// src/app/dashboard/admin/videos/_components/VideoFilters.ts

import type { FilterConfig } from "@/types/filter";

export const videoFilters: FilterConfig[] = [
  {
    id: "search",
    label: "Search",
    type: "search",
    placeholder: "Search by title or description...",
    defaultValue: "",
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "all", label: "All Status" },
      { value: "published", label: "Published" },
      { value: "draft", label: "Draft" },
      { value: "archived", label: "Archived" },
    ],
    defaultValue: "all",
  },
  {
    id: "category",
    label: "Category",
    type: "select",
    options: [
      { value: "all", label: "All Categories" },
      { value: "driving-lessons", label: "Driving Lessons" },
      { value: "parking-tips", label: "Parking Tips" },
      { value: "road-safety", label: "Road Safety" },
      { value: "exam-prep", label: "Exam Preparation" },
      { value: "vehicle-maintenance", label: "Vehicle Maintenance" },
    ],
    defaultValue: "all",
  },
  {
    id: "minDuration",
    label: "Min Duration (min)",
    type: "number",
    placeholder: "0",
    min: 0,
    max: 60,
    defaultValue: 0,
  },
  {
    id: "maxDuration",
    label: "Max Duration (min)",
    type: "number",
    placeholder: "60",
    min: 0,
    max: 60,
    defaultValue: 0,
  },
  {
    id: "sortBy",
    label: "Sort By",
    type: "radio",
    options: [
      { value: "newest", label: "Newest First" },
      { value: "oldest", label: "Oldest First" },
      { value: "mostViewed", label: "Most Viewed" },
      { value: "mostLiked", label: "Most Liked" },
    ],
    defaultValue: "newest",
  },
];