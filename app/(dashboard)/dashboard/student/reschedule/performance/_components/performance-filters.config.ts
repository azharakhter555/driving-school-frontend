// app/dashboard/admin/drivers/performance/_components/performance-filters.config.ts
import { IRELAND_COUNTIES } from "@/types/instructor.types";
import type { FilterConfig } from "@/types/filter";

export const performanceFilters: FilterConfig[] = [
  {
    id: "search",
    label: "Search Instructors",
    type: "text",
    placeholder: "Search by name, email, or ADI number...",
    width: "full",
    defaultValue: "",
  },
  {
    id: "county",
    label: "County",
    type: "select",
    options: [
      { label: "All Counties", value: "all" },
      ...IRELAND_COUNTIES.map((c) => ({ label: c, value: c })),
    ],
    defaultValue: "all",
    section: "Location",
    width: "half",
  },
  {
    id: "transmission",
    label: "Transmission",
    type: "select",
    options: [
      { label: "All", value: "all" },
      { label: "Manual", value: "manual" },
      { label: "Automatic", value: "automatic" },
      { label: "Both", value: "both" },
    ],
    defaultValue: "all",
    section: "Teaching",
    width: "half",
  },
  {
    id: "rating",
    label: "Minimum Rating",
    type: "rating",
    operator: "gte", // → ?filter.rating=$gte:4
    defaultValue: 0,
    props: { max: 5, showValue: true },
    section: "Performance",
    width: "half",
  },
  {
    id: "passRate",
    label: "Min. Pass Rate (%)",
    type: "number",
    operator: "gte",
    defaultValue: 0,
    props: { min: 0, max: 100 },
    section: "Performance",
    width: "half",
  },
  {
    id: "totalReviews",
    label: "Min. Reviews",
    type: "number",
    operator: "gte",
    defaultValue: 0,
    props: { min: 0 },
    section: "Performance",
    width: "half",
  },
  {
    id: "yearsOfExperience",
    label: "Min. Years Experience",
    type: "number",
    operator: "gte",
    defaultValue: 0,
    props: { min: 0, max: 50 },
    section: "Teaching",
    width: "half",
  },
  {
    id: "lastReviewAt",
    label: "Last Review",
    type: "date-range",
    section: "Date Filters",
    width: "full",
    defaultValue: { from: undefined, to: undefined },
  },
];
